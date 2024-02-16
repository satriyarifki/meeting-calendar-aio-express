const apiResponse = require("./../traits/api-response");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const { promisify } = require("util");
const readdirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);
const path = require("path");

exports.index = async (req, res) => {
  try {
    const { year } = req.params;
    request("https://www.tanggalan.com/" + year, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        const data = [];

        $("article ul").each((i, ul) => {
          const $ul = $(ul);
          const Tahun = $ul.find("li b").eq(0).text();
          const strBulan = $ul.find("li a").eq(0).text();
          const cleanedStr = strBulan.replace(/\d+/g, "");

          const mapBulan = {
            januari: "01",
            februari: "02",
            maret: "03",
            april: "04",
            mei: "05",
            juni: "06",
            juli: "07",
            agustus: "08",
            september: "09",
            oktober: "10",
            november: "11",
            desember: "12",
          };

          const Bulan = cleanedStr.toLowerCase().trim();
          const kodeBulan = mapBulan[Bulan];

          $ul
            .find("li")
            .eq(3)
            .find("tbody tr")
            .each((i, tr) => {
              const $tr = $(tr);
              const namaHariLibur = $tr.find("td").eq(1).text();
              const tanggal = $tr.find("td").eq(0).text();
              if (tanggal.includes("-")) {
                const date = tanggal.split("-");
                const start = parseInt(date[0]);
                const end = parseInt(date[1]);

                for (let i = start; i <= end; i++) {
                  data.push({
                    tanggal: Tahun + "-" + kodeBulan + "-" + i,
                    keterangan: namaHariLibur,
                    cuti: namaHariLibur.includes("Cuti"),
                  });
                }
              } else {
                data.push({
                  tanggal: Tahun + "-" + kodeBulan + "-" + tanggal,
                  keterangan: namaHariLibur,
                  cuti: namaHariLibur.includes("Cuti"),
                });
              }
            });
        });

        const dataJson = JSON.stringify(data);
        const filename = `${year}.json`;
        const foldername = "public/holidays-data";
        fs.writeFile(`${foldername}/${filename}`, dataJson, (err) => {
          if (err) throw err;
          console.log(`file ${year}.json berhasil dibuat`);
        });
        apiResponse.sucess(res, data, 200);
      } else {
        console.log(error);
      }
    });

    // });
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
exports.byMonthYear = async (req, res) => {
  const { month, year } = req.params;
  try {
    const files = await readdirAsync(path.join(__dirname, "./../public/holidays-data"));
    const filename = files.find((file) => file.includes(year));
    if (filename) {
      const rawData = await readFileAsync(
        path.join(__dirname, "./../public/holidays-data", `${year}.json`)
      );
      let data = JSON.parse(rawData);
      let dataFilter = data.filter(
        (dt) =>
          dt.tanggal.slice(0, 4) == year &&
          Number(dt.tanggal.slice(5, 7)) == Number(month)
      );
      res.status(200).json(dataFilter);
    } else {
      res.status(404).json({
        message: "Data tidak tersedia.",
      });
    }

    // request("https://www.tanggalan.com/" + year, (error, response, html) => {
    //   if (!error && response.statusCode == 200) {
    //     const $ = cheerio.load(html);
    //     let data = [];

    //     $("article ul").each((i, ul) => {
    //       const $ul = $(ul);
    //       const Tahun = $ul.find("li b").eq(0).text();
    //       const strBulan = $ul.find("li a").eq(0).text();
    //       const cleanedStr = strBulan.replace(/\d+/g, "");

    //       const mapBulan = {
    //         januari: "01",
    //         februari: "02",
    //         maret: "03",
    //         april: "04",
    //         mei: "05",
    //         juni: "06",
    //         juli: "07",
    //         agustus: "08",
    //         september: "09",
    //         oktober: "10",
    //         november: "11",
    //         desember: "12",
    //       };

    //       const Bulan = cleanedStr.toLowerCase().trim();
    //       const kodeBulan = mapBulan[Bulan];

    //       $ul
    //         .find("li")
    //         .eq(3)
    //         .find("tbody tr")
    //         .each((i, tr) => {
    //           const $tr = $(tr);
    //           const namaHariLibur = $tr.find("td").eq(1).text();
    //           const tanggal = $tr.find("td").eq(0).text();
    //           if (tanggal.includes("-")) {
    //             const date = tanggal.split("-");
    //             const start = parseInt(date[0]);
    //             const end = parseInt(date[1]);

    //             for (let i = start; i <= end; i++) {
    //               data.push({
    //                 tanggal:
    //                   Tahun + "-" + kodeBulan + "-" + i,
    //                 keterangan: namaHariLibur,
    //                 cuti: namaHariLibur.includes("Cuti"),
    //               });
    //             }
    //           } else {
    //             data.push({
    //               tanggal:
    //                 Tahun + "-" + kodeBulan + "-" + tanggal,
    //               keterangan: namaHariLibur,
    //               cuti: namaHariLibur.includes("Cuti"),
    //             });
    //           }
    //         });
    //     });

    //     // const dataJson = JSON.stringify(data);
    //     // const filename = `${year}.json`;
    //     // const foldername = "data";
    //     // fs.writeFile(`${foldername}/${filename}`, dataJson, (err) => {
    //     //   if (err) throw err;
    //     //   console.log(`file ${year}.json berhasil dibuat`);
    //     // });
    //     data = data.filter(
    //       (dt) =>
    //         dt.tanggal.slice(0, 4) == year &&
    //         Number(dt.tanggal.slice(5, 7)) == Number(month)
    //     );

    //     apiResponse.sucess(res, data, 200);
    //   } else {
    //     console.log(error);
    //   }
    // });

    // });
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
