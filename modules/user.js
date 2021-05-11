let mongoose=require("mongoose");

let Schema=mongoose.Schema;
let roomschema=new mongoose.Schema({
	roomnum:Number,
	occupancy:Boolean,
	sharing:Number,
	users:[{user:{ type: Schema.Types.ObjectId, ref: 'user' }}],
	payments:[{feedetails:{ type: Schema.Types.ObjectId, ref: 'feedetails' }}]
})
let room=mongoose.model("room",roomschema);

let feeschema=new mongoose.Schema({
	payment_date:Date,
	user_id:{ type: Schema.Types.ObjectId, ref: 'user' },
	roomnum:Number,
	username:String
})
let feedetails=mongoose.model("feedetails",feeschema);
let complschema=new mongoose.Schema({
	roomnum:Number,
	complaint:String
})
let complaint=mongoose.model("complaint",complschema);

let userschema=new mongoose.Schema({
	id:Number,
	name:String,
	mobnum:String,
	emailid:String,
	password:String,
	logintoken:String,
	room_id:{ type: Schema.Types.ObjectId, ref: 'room' },
	payments:[{feedetails:{ type: Schema.Types.ObjectId, ref: 'feedetails' }}]
})
let user=mongoose.model("user",userschema);

module.exports={ user,feedetails,room,complaint}