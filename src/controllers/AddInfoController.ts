import express from "express";
import { Op, UniqueConstraintError } from "sequelize";
import sequelize from "../core/dbconfig";
import { AddInfo, AddInfoCreationAttributes } from "../models/SAddInfo";
import { User } from "../models/SUser";

interface FilterQuery {
  user_id: number;
  address: string;
  sex: string;
  badHabits: boolean;
  pets: boolean;
  startAge: number;
  endAge: number;
}

class AddInfoController {
  userRepository = sequelize.getRepository(User);
  addInfoRepository = sequelize.getRepository(AddInfo);

  create = async (req: express.Request, res: express.Response) => {
    const user = req.user as User;

    const postData: AddInfoCreationAttributes = {
      age: req.body.age,
      address: req.body.address,
      sex: req.body.sex,
      hasPets: req.body.pets,
      hasBadHabits: req.body.badHabits,
      isStudent: req.body.kindOfActivity,
      hasJob: req.body.haveJobOrJobless,
      isMarried: req.body.maritalStatus,
      phoneNumber: req.body.phoneNumber,
      moreAbout: req.body.moreAboutUser,
    };

    try {
      const addInfo = await AddInfo.create(postData).catch((error) => {
        if (error instanceof UniqueConstraintError) {
          res.status(500).json({
            status: "error",
            message: "Such addinfo already exists",
          });
        } else {
          res.status(500).json({
            status: "error",
            message: error,
          });
        }
      });
      if (addInfo) {
        await addInfo.save();

        await addInfo.$set("user", [user.id]);
        const userEntity = await User.findByPk(user.id);
        if (userEntity) {
          await userEntity.$set("info", [addInfo.id]);
          await userEntity.save();
        }
      }
      return res.json(addInfo);
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error,
      });
    }
  };

  update = async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id);

    const postData = {
      age: req.body.age,
      address: req.body.adress,
      sex: req.body.sex,
      hasPets: req.body.pets,
      hasBadHabits: req.body.badHabits,
      isStudent: req.body.kindOfActivity,
      hasJob: req.body.haveJobOrJobless,
      isMarried: req.body.maritalStatus,
      phoneNumber: req.body.phoneNumber,
      moreAbout: req.body.moreAboutUser,
    };

    try {
      const addInfo = await AddInfo.update(postData, {
        where: { id: id },
      }).catch((error) => {
        if (error instanceof UniqueConstraintError) {
          res.status(500).json({
            status: "error",
            message: "Such addinfo already exists",
          });
        } else {
          res.status(500).json({
            status: "error",
            message: error,
          });
        }
      });
      if (addInfo) {
        return res.json("updated");
      } else {
        return res.json("error");
      }
    } catch (err) {
      return res.status(500).json({
        status: "error with updating",
        message: err,
      });
    }
  };

  index = (req: express.Request, res: express.Response) => {
    const id: string = String((req.user as User).id);

    try {
      const additionalInfo = AddInfo.findOne({
        where: { id: id },
        include: { all: true },
      });
      if (!additionalInfo) {
        return res.status(404).json({
          status: "error",
          message: "additionalInfo not found",
        });
      }
      return res.json(additionalInfo);
    } catch (err) {
      return res.status(404).json({
        status: "error",
        message: err,
      });
    }
  };

  getAll = async (req: any, res: any) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalCount = Number((await AddInfo.findAndCountAll()).count);

    const results = {
      totalCount,
      next: {},
      previous: {},
      results: {},
    };

    if (endIndex < totalCount) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.results = await AddInfo.findAll({
      include: { all: true },
      limit: limit,
    });
    return res.json(results);
  };

  filterUsers = async (req: any, res: express.Response) => {
    const startAge = req.query.startAge;
    const endAge = req.query.endAge;
    const userId = req.query.id;

    const pets = req.query.pets;
    const badHabits = req.query.badHabits;
    const sex = req.query.sex;
    const address = req.query.adress;

    const queryObj: FilterQuery = {} as FilterQuery;
    const queryArray = [];

    const isTrueQuery = (value: string) => value === "true";

    if (userId !== "undefined" && userId !== undefined) {
      queryObj.user_id = userId;
      queryArray.push({
        user_id: queryObj.user_id,
      });
    }

    if (
      (endAge && startAge) !== "undefined" &&
      (endAge && startAge) !== undefined
    ) {
      queryObj.startAge = parseInt(startAge);
      queryObj.endAge = parseInt(endAge);
      queryArray.push({
        age: {
          [Op.and]: {
            [Op.gt]: queryObj.startAge,
            [Op.lt]: queryObj.endAge,
          },
        },
      });
    }

    if (address !== "undefined" && address !== undefined) {
      queryObj.address = address;
      queryArray.push({
        address: queryObj.address,
      });
    }

    if (pets !== "undefined" && pets !== undefined) {
      isTrueQuery(pets) ? (queryObj.pets = true) : (queryObj.pets = false);
      queryArray.push({
        hasPets: queryObj.pets,
      });
    }

    if (badHabits !== "undefined" && badHabits !== undefined) {
      isTrueQuery(badHabits)
        ? (queryObj.badHabits = true)
        : (queryObj.badHabits = false);
      queryArray.push({
        hasBadHabits: queryObj.badHabits,
      });
    }
    if (sex !== "undefined" && sex !== undefined) {
      queryObj.sex = sex;
      queryArray.push({
        sex: queryObj.sex,
      });
    }

    try {
      const addInfos = await AddInfo.findAll({
        where: {
          [Op.and]: queryArray,
        },
        include: { all: true },
      });
      return res.json(addInfos);
    } catch (err) {
      return res.status(404).json({
        message: "Users not found",
        err,
      });
    }
  };
}

export default AddInfoController;
