const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const idPattern = /^(?=.*[a-zA-Z])(?=.*[\d]).+$/;
const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[\d])(?=.*[!@#$%^&*()-_=+₩~\{\}\[\]\|\:\;\"\'\<\>\,.\?\/]).+$/;

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "ID를 입력해주세요."],
    unique: true,
    min: 8,
    max: 20,
    validate: {
      validator: (v) => idPattern.test(v),
      message: "8~20자이고 영어 대소문자, 숫자를 하나 이상 포함해야 합니다.",
    },
  },
  password: {
    type: String,
    required: [true, "비밀번호를 입력해주세요."],
    min: 8,
    max: 32,
    validate: {
      validator: (v) => passwordPattern.test(v),
      message: "8~32자이고 영어 대소문자, 숫자, 특수문자를 하나 이상 포함해야 합니다.",
    },
  },
});

UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.validateAsync = async function() {
  try {
    await this.validateSync();
  } catch (error) {
    throw error;
  }
};

UserSchema.methods.comparePassword = async function(inputPassword) {
  if (!inputPassword) return false;

  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
