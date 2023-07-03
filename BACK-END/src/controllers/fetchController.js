import fetTomodat from "../models/fetchModel.js";
import { fetchTomodat } from "../scripts/fetchApiTomodat.js";
import PppoeData from "../models/pppoeModel.js";
import newFetch from "../models/newetchWithPppoe.js";

class fetTomodatController {
  static CadastrarFetch = (req, res) => {
    fetchTomodat().then((data) => {
      data.forEach((element) => {
        JSON.stringify(element);
        let fet = new fetTomodat(element);
        fet.save((err) => {
          if (err) {
            console.log({ message: `${err.message} - falha ao cadastrar.` });
          } else {
            console.log({
              message: `elemento do fetch cadastrado com sucesso`,
            });
          }
        });
      });
      res.send({ message: "fetch cadastrado com sucesso" });
    });
  };

  static UpdateFetch = (req, res) => {
    let now = new Date();
    fetchTomodat().then((data) => {
      data.forEach((element) => {
        JSON.stringify(element);
        let dados = element;
        let id = dados.id;
        fetTomodat.findOneAndUpdate({ id: id }, { $set: dados }, (err) => {
          if (!err) {
            console.log({ message: `Fetch atualizado com susesso. ${now}` });
          } else {
            console.log({ message: err.message });
          }
        });
      });
      res.send({ message: "fetch atualizado com sucesso" });
    });
  };

  static ListarFetch = (req, res) => {
    fetTomodat.find((err, fetTomodats) => {
      res.status(200).json(fetTomodats);
    });
  };

  static FetchWithCtoCLient = (req, res) => {
    let fetchtomodatsModel = fetTomodat;
    const pipeline = [
      {
        $lookup: {
          from: "ctoclients",
          let: { cto_id: "$id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$cto_id", "$$cto_id"] } } },
            {
              $project: {
                id: 1,
                name: 1,
                lat: 1,
                lng: 1,
                cto_id: 1,
                user: 1,
                date_time: 1,
              },
            },
          ],
          as: "cto_clients_loc",
        },
      },
    ];

    fetchtomodatsModel.aggregate(pipeline).exec((err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(result);
      }
    });
  };

  static FetchWithCtoClientsPppoe = (req, res) => {
    let fetchtomodatsModel = fetTomodat;
    const pipeline = [
      {
        $lookup: {
          from: "pppoedatas",
          let: { cto_id: "$id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$cto_id", "$$cto_id"] } } },
            {
              $project: {
                id: 1,
                name: 1,
                lat: 1,
                lng: 1,
                cto_id: 1,
                cto_name: 1,
                pppoe: 1,
                pppoeVerified: 1,
              },
            },
          ],
          as: "pppoe_clients",
        },
      },
    ];

    fetchtomodatsModel.aggregate(pipeline).exec((err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(result);
      }
    });
  };

  static FetchWithCtoClientsPppoeInsideClients = (req, res) => {
    let fetchtomodatsModel = fetTomodat;
    const pipeline = [
      {
        $lookup: {
          from: "pppoedatas",
          let: { clients: "$clients.name" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$name", "$$clients"] },
              },
            },
            {
              $project: {
                name: 1,
                pppoe: 1,
                pppoe_name: "$name",
                verified: { $ifNull: ["$pppoeVerified", false] },
              },
            },
          ],
          as: "pppoe_clients",
        },
      },
      {
        $addFields: {
          clients: {
            $map: {
              input: "$clients",
              as: "client",
              in: {
                $mergeObjects: [
                  "$$client",
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$pppoe_clients",
                          cond: {
                            $eq: ["$$this.name", "$$client.name"],
                          },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          pppoe_clients: 0,
        },
      },
    ];

    fetchtomodatsModel.aggregate(pipeline).exec((err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(result);
      }
    });
  };

  static FetchWithCtoClientsPppoeInsideClientsNewCollection = (req, res) => {
    let fetchtomodatsModel = fetTomodat;
    const pipeline = [
      {
        $lookup: {
          from: "pppoedatas",
          let: { clients: "$clients.name" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$name", "$$clients"] },
              },
            },
            {
              $project: {
                name: 1,
                pppoe: 1,
                pppoe_name: "$name",
                verified: { $ifNull: ["$pppoeVerified", false] },
              },
            },
          ],
          as: "pppoe_clients",
        },
      },
      {
        $addFields: {
          clients: {
            $map: {
              input: "$clients",
              as: "client",
              in: {
                $mergeObjects: [
                  "$$client",
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$pppoe_clients",
                          cond: {
                            $eq: ["$$this.name", "$$client.name"],
                          },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          pppoe_clients: 0,
        },
      },
    ];

    fetchtomodatsModel.aggregate(pipeline).exec((err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        // Check the presence of the city field and provide a default value if missing
        const documentsToSave = result.map((doc) => {
          if (!doc.city) {
            doc.city = "Default City"; // Provide a default value for the city field
          }
          return doc;
        });

        // Save the modified documents as a new collection
        newFetch.insertMany(documentsToSave, (err, savedResult) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).send(savedResult);
          }
        });
      }
    });
  };

  static newfetchupdate = (req, res) => {
    let fetchtomodatsModel = fetTomodat;

    const pipeline = [
      {
        $lookup: {
          from: "pppoedatas",
          let: { clients: "$clients.name" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$name", "$$clients"] },
              },
            },
            {
              $project: {
                name: 1,
                pppoe: 1,
                pppoe_name: "$name",
                verified: { $ifNull: ["$pppoeVerified", false] },
              },
            },
          ],
          as: "pppoe_clients",
        },
      },
      {
        $addFields: {
          clients: {
            $map: {
              input: "$clients",
              as: "client",
              in: {
                $mergeObjects: [
                  "$$client",
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$pppoe_clients",
                          cond: {
                            $eq: ["$$this.name", "$$client.name"],
                          },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          pppoe_clients: 0,
        },
      },
    ];

    fetchtomodatsModel.aggregate(pipeline).exec((err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        const bulkOperations = result.map((doc) => ({
          updateOne: {
            filter: { _id: doc._id },
            update: doc,
            upsert: true,
          },
        }));

        // Update the new collection with the modified documents
        newFetch.bulkWrite(bulkOperations, (err, updateResult) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).send(updateResult);
          }
        });
      }
    });
  };

  static ListarFetchPppoeAndDelete = async (req, res) => {
    try {
      let fetchTomodatsModel = fetTomodat;
      let pppoeDataModel = PppoeData;

      // Step 1: Fetch all names from the pppoeData collection
      const pppoeDataNames = await pppoeDataModel.distinct("name");

      // Step 2: Fetch all names from the clients field in the fetTomadat collection
      const fetTomadatClients = await fetchTomodatsModel.distinct(
        "clients.name"
      );

      // Step 3: Find the names in pppoeDataNames that don't exist in fetTomadatClients
      const namesToDelete = pppoeDataNames.filter((name) => {
        const isNotIncluded = !fetTomadatClients.includes(name);
        if (isNotIncluded) {
          const objectToDelete = { name };
          console.log(objectToDelete); // Log the object
        }
        return isNotIncluded;
      });

      // Step 4: Delete the objects from the pppoeData collection
      await pppoeDataModel.deleteMany({ name: { $in: namesToDelete } });

      // Step 5: Send a success response
      res.status(201).send(namesToDelete);
    } catch (error) {
      // Step 6: Log the error
      console.error("An error occurred:", error);

      // Step 7: Send an error response
      res.status(500).send(error);
    }
  };

  static ListarFetchNew = (req, res) => {
    newFetch.find((err, fetTomodats) => {
      res.status(200).json(fetTomodats);
    });
  };
}

export default fetTomodatController;
