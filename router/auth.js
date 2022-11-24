require("../db/conn");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const cookieParser = require("cookie-parser");
const User = require("../models/userSchema");
const Group = require("../models/GroupSchema");
const UserGroup = require("../models/UserGroupSchema");
const Transaction = require("../models/transactionSchema");
const authenticate = require("../middleware/authenticate");
const mainLogic = require("../sdebt_logic");
router.use(cookieParser());
// functions------------------------------------------------------------

// get user data by email
const getUserByEmail = async (email) => {
  const userExist = await User.findOne({ email: email });
  if (userExist) {
    const data = await User.findOne({ email: email });
    return data;
  } else {
    return false;
  }
};

const add_members = () => {};

// ROUTES-------------------------------------------------------

router.get("/", (req, res) => {
  res.send("Home page router");
});

//USER----------------------------------------------
// get all users
router.get("/user", async (req, res) => {
  let list = [];
  await User.find()
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((e) => {
      res.status(500).json({ error: "Failed to connect" });
    });
});

// check user exist or not
router.post("/user/check", async (req, res) => {
  const { email } = req.body;
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      const getUserData = await User.findOne({ email: email });
      res.status(200).json(getUserData);
    } else {
      res.status(404).json({ message: "User doesn't exist" });
    }
  } catch (e) {
    res.status(500).json({ error: "Error occured" });
    console.log(e);
  }
});
// get user data by id

router.post("/user", async (req, res) => {
  const { id } = req.body;
  const userExist = await User.findOne({ _id: id });
  try {
    if (userExist) {
      const getUserData = await User.findOne({ _id: id });
      res.status(200).json(getUserData);
    } else {
      res.status(404).json({ message: "User down't exist" });
    }
  } catch (e) {
    res.status(500).json({ error: "Error occured" });
    console.log(e);
  }
});

// update user data
router.post("/user/update", async (req, res) => {
  const toUpdateData = req.body;
  try {
    const userExist = await User.findOne({ _id: toUpdateData[0] });
    if (userExist) {
      const updateRes = await User.updateOne(
        { _id: toUpdateData[0] },
        toUpdateData[1]
      );
      res.status(200).json(updateRes);
    } else {
      res.status(401).json({ error: "user doesn't exist" });
    }
  } catch (e) {
    res.send(500).json({ error: "Error Occured" });
    console.log(e);
  }
});

// Group---------------------------------------------
// get all data of all groups
router.get("/group", async (req, res) => {
  let list = [];
  await Group.find()
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((e) => {
      res.status(500).json({ error: "Failed to connect" });
    });
});

// get group data by userid
router.post("/group/user", async (req, res) => {
  const fetched = req.body;
  let list = [];
  await Group.find({ members: fetched._id })
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((e) => {
      res.status(500).json({ error: "Failed to connect" });
    });
});

router.post("/group/members", async (req, res) => {
  const fetched = req.body;
  console.log(fetched._id);
  let list = [];
  await Group.find({ members: fetched._id })
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((e) => {
      res.status(500).json({ error: "Failed to connect" });
    });
});

// create a group
const membersArrayById = ({ id, members }) => {
  let idArray = [id];
  console.log(members);
  idArray.push(...members);
  return idArray;
};

// showAmount: [[0,0],[0,0]] for two members with showAmount[0][0] = get and other is give
// simplified is a 2D array
router.post("/group", async (req, res) => {
  const { name, id, members } = req.body;
  if (!name) {
    return res
      .status(422)
      .send({ status: 422, message: "Enter the required fields" });
  }
  const createGroup = await Group({
    name: name,
    members: membersArrayById({ id, members }),
  });
  const addTransactionSlot = await Transaction({
    gid: createGroup._id,
    transactions: [],
    showAmount: new Array(members.length + 1).fill(new Array(2).fill(0)),
    simplified: 0
  });
  await addTransactionSlot.save();
  createGroup
    .save()
    .then(async () => {
      res.status(200).json({ message: "Data saved successfuly" });
    })
    .catch((e) => {
      res.status(500).json({ error: "Failed to create group", error: e });
    });
});

// add members to group
// const addNewMemberToGroup = async({gid,original,members})=>{
//     let idArray = original.members;
//     for(let i of members){
//         const getUserIdByEmail = await getUserByEmail(i);
//         if(getUserIdByEmail){
//             idArray.push(getUserIdByEmail._id);
//         }
//     }
//     return idArray;
// }
router.post("/group/add", async (req, res) => {
  const { gid, members } = req.body;
  try {
    const groupExist = await Group.findOne({ _id: gid });
    if (groupExist) {
      const getGroupData = await Group.findOne({ _id: gid });
      const addMembers = await Group.updateOne(
        { _id: gid },
        { members: members }
      );
      if (addMembers) {
        const getTransaction = await Transaction.findOne({gid:gid});
        const sa = [...getTransaction.showAmount,[0,0]]
        const simple = getTransaction.simplified !== 0 ? [...getTransaction.simplified,new Array(members.length).fill(0)] : 0;
        const updateTransactionSlot = await Transaction.updateOne({gid:gid},{
          showAmount: sa,
          simplified: simple
        });
        res.status(200).json({ message: "Members added succcesfully" });
      } else {
        res.status(500).json({ message: "Error occured" });
      }
    } else {
      res.status(404).json({ message: "Group doen't exist" });
    }
  } catch (e) {
    res.status(500).json({ message: "Error occured" });
  }
});

// transaction-----------------------------------------------------------------

// get all trasaction
router.get("/transaction", (req, res) => {
  let list = [];
  Transaction.find()
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((e) => {
      res.status(500).json({ error: "Failed to connect" });
    });
});

// get transaction by group id
const getTransactionByGid = async (gid) => {
  try {
    const data = await Transaction.findOne({ gid: gid });
    if (data !== null) {
      return data;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};

router.post("/transaction", async (req, res) => {
  const { gid } = req.body;
  console.log(gid);
  const getData = await getTransactionByGid(gid);
  if (getData) {
    res.status(200).json(getData);
  } else {
    res.status(404).json({ message: "Doesn't exist" });
  }
});

// get transaction by label
router.post("/transaction/label", async (req, res) => {
  const { gid, label } = req.body;
  const getData = await getTransactionByGid(gid);
  if (getData) {
    const dataFilteredByLabel = getData.filter((item) => item.label === label);
    res.status(200).json(dataFilteredByLabel);
  } else {
    res.status(404).json({ message: "Doesn't exist" });
  }
});

// add transaction

router.post("/transaction/add", async (req, res) => {
  const { gid, fromTo, amount, description, label, date } = req.body;
  try {
    console.log(req.body);
    const getTransactionOuterData = await Transaction.findOne({ gid: gid });
    const [newShowAmount, newSimplified] = mainLogic(
      fromTo,
      getTransactionOuterData.showAmount,
      getTransactionOuterData.simplified,
      amount
    );
    const postData = await Transaction.updateOne(
      { gid: gid },
      {
        $push: { transactions: { fromTo, amount, description, label, date } },
        simplified: newSimplified,
        showAmount: newShowAmount,
      }
    );
    if (postData) {
      res.status(200).json({ message: "Data saved successfuly" });
    } else {
      res.status(500).json({ error: "Error occured" });
    }
  } catch (e) {
    res
      .status(500)
      .json({ status: 500, message: "Failed to add transaction", error: e });
  }
});

// minimal transaction logic endpoint
router.post("/simplify", (req, res) => {
  const { fromTo, showAmount, simplified, amount } = req.body;
  const response = mainLogic(fromTo, showAmount, simplified, amount);
  res.status(200).json({
    showAmount: response[0],
    simplified: response[1],
  });
});

router.post("/register", async (req, res) => {
  const { name, email, password, cpassword } = req.body;
  if (!name || !email || !password || !cpassword) {
    return res
      .status(422)
      .json({ status: 422, message: "Enter the required fields" });
  }
  if (password != cpassword) {
    return res
      .status(422)
      .json({ error: "Password and confirm password are not matching" });
  }
  User.findOne({ email: email })
    .then((userExist) => {
      if (userExist) {
        return res
          .status(423)
          .json({ status: 423, message: "Email already exists" });
      }
      const user = new User({ name, email, password, cpassword });

      // hashing password using pre(save)

      user
        .save()
        .then(() => {
          res
            .status(200)
            .json({ status: 200, message: "Data saved successfuly" });
        })
        .catch((e) => {
          res
            .status(500)
            .json({ status: 500, message: "Failed to register", error: e });
        });
    })
    .catch((e) => {
      res.status(500).json({ status: 500, error: "Failed to connect" });
    });
});

router.post("/login", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ status: 401, error: "Incorrect username or password" });
    }
    const userLogin = await User.findOne({ email: email });
    if (userLogin) {
      // comparing hashing
      const isMatched = await bcrypt.compare(password, userLogin.password);

      // jwt token generate
      token = await userLogin.generateAuthToken();
      // storing to cookie
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000), //30 days expiry
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      if (!isMatched) {
        res
          .status(401)
          .json({ status: 401, error: "Incorrect username or password" });
      } else {
        res.status(200).json({ status: 200, message: "login successfully" });
      }
    } else {
      res
        .status(401)
        .json({ status: 401, error: "Incorrect username or password" });
    }
  } catch (e) {
    res.status(500).json({ error: "Failed to connect" });
  }
});

router.get("/dashboard", authenticate, (req, res) => {
  if (req.login) {
    res.send(req.rootUser);
  } else {
    res.status(401);
  }
});
router.post("/logout", async (req, res) => {
  const fetched = req.body;
  try {
    await User.update(
      { _id: fetched._id },
      { $pull: { tokens: { token: fetched.tokens[0].token } } },
      { multi: true }
    );
    res.status(200);
  } catch (e) {
    res.status(500);
  }
});

module.exports = router;
