const mongoose=require('mongoose')

const bcrypt=require('bcrypt')
const userSchema=new mongoose.Schema({
  name: {type:String,trim:true},
  email:{type:String,unique:true,trim:true,
    lowercase:true},
    password:String,
  title: String,
  contact: {
    phone: String,
    email: String,
    address: String,
    institution: String,
    city: String,
    country: String,
  },
  summary: String,

  experiences: [
      {
        position: String,
        institution: String,
        location: String,
        startDate: Date,
        endDate: Date,
        description: String,
      }],
  skills: [{skill: String,
  level: String,}],

  educations: [{
    degree: String,
  field: String,
  institution: String,
  location: String,
  graduationDate: Date,
  gpa: Number,
  thesis: String,}],

  languages: [{language: String,
  proficiency: String,}],

  certificates: [{title: String,
  institution: String,
  date: Date,
  description: String,}],

  awards: [
    {
        title: String,
  institution: String,
  year: Number,
  description: String,
}],

  publications: [{title: String,
  journal: String,
  volume: String,
  pages: String,
  year: Number,
  url: String,
  doi: String,}],
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password=await bcrypt.hash(this.password,12)
    this.passwordConfirm=undefined
    next()
})
userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}

module.exports=mongoose.model('user',userSchema)