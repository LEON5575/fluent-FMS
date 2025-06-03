const mongoose = require('mongoose');

const smtpConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  host: {
    type: String,
    required: true,
    trim: true
  },
  port: {
    type: Number,
    required: true
  },
  //!here status is 1 then active and 5 means deleted softly i.e inactive
  status:{
      type:Number,
      enum:[1,5],
      default:1//default value of status is 1 means active
  },
  secure: {
    type: Boolean,
    default: false
  },
  authUser: {
    type: String,
    required: true,
    trim: true
  },
  authPass: {
    type: String,
    required: true
  },
  deleted: {
    type: Boolean,
    default: false 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SMTPConfig', smtpConfigSchema);
