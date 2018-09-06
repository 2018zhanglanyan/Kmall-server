const Router=require('express').Router;
const router=Router();
const UserModel = require('../models/userModle.js');
const hmac = require('../util/hmac.js')

router.post("/login",(req,res)=>{
	let body = req.body;
	//定义返回数据
	let result  = {
		code:0,// 0 代表成功 
		message:''
	}
	UserModel
	.findOne({username:body.username,password:hmac(body.password),isAdmin:false})
	.then((user)=>{
		if(user){//登录成功
			 req.session.userInfo = {
			 	_id:user._id,
			 	username:user.username,
			 	isAdmin:user.isAdmin,
			 }
			 result.data = {
			 	username:user.username
			 }
			 res.json(result);
		}else{
			result.code = 1;
			result.message = '用户名和密码不匹配';
			res.json(result);
		}
	})
})

router.post('/register',(req,res)=>{
	var body = req.body;
	new UserModel({
		username:body.username,
		password:hmac(body.password),
		phone:body.phone,
		email:body.email
	})
	.save()
	.then((result)=>{
		res.json({
			code:0
		})
	})
	.catch(()=>{
		res.json({
			code:1,
			message:'往数据库添加时出错'
		})
	})
});


router.post("/checkUsername",(req,res)=>{
	let username = req.body.username;
	UserModel
	.findOne({username:username})
	.then((user)=>{
		if(user){
			 res.json({
			 	code:1,
			 	message:'用户名已存在'
			 });
		}else{
			res.json({
			 	code:0,
			 });
		}
	})
})











/*
router.get("/init",(req,res)=>{
	//定义返回数据
	let result  = {
		code:0,// 0 代表成功 
		message:''
	}
		let data=[];
		for(let i=0 ;i<100;i++){
			data.push({
			  key:i,
			  username: 'test'+i,
			  password:hmac('test'+i),
			  isAdmin: false,
			  phone:'135'+i,
			  email:'test'+i+'@qq.com'
			})
		}
	UserModel.create(data)
	.then((err,newUser)=>{
		res.send('ok')
	})
})
router.get("/initer",(req,res)=>{
	//定义返回数据
	let result  = {
		code:0,// 0 代表成功 
		message:''
	}
		let data=[];
		for(let i=0 ;i<1;i++){
			data.push({
			  key:0,
			  username: 'admin',
			  password:hmac('admin'),
			  isAdmin: true,
			})
		}
	UserModel.create(data)
	.then((err,newUser)=>{
		res.send('ok')
	})
})
*/

/*
//权限控制
router.use((req,res,next)=>{
	if(req.userInfo._id){
		next()
	}else{
		res.send({
			code:1,
		});
	}
})
*/

router.get('/logout',(req,res)=>{
	let result = {
		code:0,
		massage:''
	}
	req.session.destroy();
	res.json(result);
})


router.get('/userInfo',(req,res)=>{
	if(req.userInfo._id){
		res.json({
			code:0,
			data:req.userInfo
		})
	}else{
		res.json({
			code:1
		})
	}
})





module.exports = router;







