const Validator = require("fastest-validator");
const v = new Validator();
const { participants } = require("./../models");
// let { startOfDay, endOfDay, parseISO } = require('date-fns');
const apiResponse = require("./../traits/api-response");
const { Op } = require("sequelize");
const request = require("request");
const cheerio = require("cheerio");

exports.test = async (req, res) => {
  try {
    let test;
    request("https://www.tanggalan.com/2024", (error, response, html) => {
      test = html;
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
                    tanggal: Tahun + "-" + kodeBulan + "-" + i.toString(),
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

        // const dataJson = JSON.stringify(data);
        // const filename = `${year}.json`;
        // const foldername = "data";
        // fs.writeFile(`${foldername}/${filename}`, dataJson, (err) => {
        //   if (err) throw err;
        //   console.log(`file ${year}.json berhasil dibuat`);
        // });
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

exports.index = async (req, res) => {
  try {
    const response = await participants.findAll({
      attributes: ["eventId", "email"],
    });

    apiResponse.sucess(res, response, 200);

    // });
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};

exports.store = async (req, res) => {
  try {
    const response = await participants.create(req.body, {
      fields: ["eventId", "email"],
    });

    apiResponse.sucess(res, response, 201);
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
exports.destroy = async (req, res) => {
  try {
    const id = req.params.eventId;
    let data = await participants.findAll({
      where: {
        eventId: id,
      },
      attributes: ["eventId", "email"],
    });

    if (!data) {
      apiResponse.sucess(res, "Data is not found!", 203);
    }

    await participants.destroy({
      where: {
        eventId: id,
      },
    });

    res.status(200).json({ message: "Data was deleted!" });
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
