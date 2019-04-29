var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
var xl_mongo = require('../public/js/KET_NOI')
var md5 = require('md5');
cl_hoa_don = 'hoa_don'
cl_san_pham = 'san_pham'
cl_nguoi_dung = 'nguoi_dung'
cl_thuong_hieu = 'thuong_hieu'
cl_loai_san_pham='loai_san_pham'
cl_nha_cung_cap='nha_cung_cap'


//đăng nhập
router.post('/dang-nhap', async function (req, res, next) {
  let db = await xl_mongo.Get();
  var dk = { 'email': req.body.email, 'password': md5(req.body.password), 'chuc_vu': 'khách hàng' }
  await db.collection(cl_nguoi_dung).find(dk).toArray((err, result) => {
    if (result.length != 1) {
      var kq = { 'errorCode': 1, 'message': 'Sai tên đăng nhập hoặc mật khẩu' }
      res.json(JSON.stringify(kq))
    }
    else {
      if (result[0].trang_thai == 'khóa') {
        var kq = { 'errorCode': 2, 'message': 'Tài khoản đã bị khóa' }
        res.json(kq)
      }
      else {
        var kq = {
          'errorCode': 0,
          'message': 'Đăng nhập thành công',
          'data': {
            'khach_hang_Id': result[0]._id,
            'khach_hang_Ten': result[0].ho_ten,
            'khach_hang_Email': result[0].email,
            'khach_hang_Dia_chi': result[0].dia_chi,
            'khach_hang_Dien_thoai': result[0].dien_thoai,
          }
        }
        res.json(kq)
      }
    }
  })
});

//thêm loại sản phẩm mới
router.post('/them-loai-san-pham',async function(req,res,next){
  var loai={'ten_loai':req.body.ten_loai,'thu_muc_hinh':req.body.thu_muc_hinh}
  let db=await xl_mongo.Get();
  await db.collection(cl_loai_san_pham).insert(loai,(err,result)=>{
    if(err)
    {
      var kq={'errorCode':1,'message':'Không thêm được'}
      res.json(kq)
    }
    else
    {
      var kq={
        'errorCode':0,
        'message':'Thêm thành công',
      }
      res.json(kq)
    }
  })
});

//thêm thương hiệu
router.post('/them-thuong-hieu',async function(req,res,next){
  var thuong_hieu={'ten_thuong_hieu':req.body.ten_thuong_hieu,'hinh':req.body.hinh}
  let db=await xl_mongo.Get();
  await db.collection(cl_thuong_hieu).insert(thuong_hieu,(err,result)=>{
    if(err)
    {
      var kq={'errorCode':1,'message':'Không thêm được'}
      res.json(kq)
    }
    else
    {
      var kq={
        'errorCode':0,
        'message':'Thêm thành công',
      }
      res.json(kq)
    }
  })
});

//lấy nhà cung cấp
router.get('/lay-nha-cung-cap', async function (req, res, next) {
  let db = await xl_mongo.Get();
  db.collection(cl_nha_cung_cap).find({}).toArray((err, result) => {
    if (result.length == 0) {
      var kq = {
        'errorCode': 1,
        'message': 'Không tìm thấy'
      }
      res.json(kq)
    }
    else {
      var kq = {
        'errorCode': 0,
        'data':result
      }
      res.json(kq)
    }
  })
});

//thêm nhà cung cấp
router.post('/them-nha-cung-cap',async function(req,res,next){
  var nha_cung_cap={'ten_ncc':req.body.ten_ncc,'dia_chi':req.body.dia_chi,'dien_thoai':req.body.dien_thoai,'email':req.body.email}
  let db=await xl_mongo.Get();
  await db.collection(cl_nha_cung_cap).insert(nha_cung_cap,(err,result)=>{
    if(err)
    {
      var kq={'errorCode':1,'message':'Không thêm được'}
      res.json(kq)
    }
    else
    {
      var kq={
        'errorCode':0,
        'message':'Thêm thành công',
      }
      res.json(kq)
    }
  })
});

//lấy danh sách người dùng
router.get('/lay-nguoi-dung', async function (req, res, next) {
  let db = await xl_mongo.Get();
  var dk={'trang_thai':'đang hoạt động'}
  db.collection(cl_nguoi_dung).find(dk).toArray((err, result) => {
    if (result.length == 0) {
      var kq = {
        'errorCode': 1,
        'message': 'Không tìm thấy'
      }
      res.json(kq)
    }
    else {
      var kq = {
        'errorCode': 0,
        'data':result
      }
      res.json(kq)
    }
  })
});

//lấy thương hiệu
router.get('/lay-thuong-hieu', async function (req, res, next) {
  let db = await xl_mongo.Get();
  db.collection(cl_thuong_hieu).find({}).toArray((err, result) => {
    if (result.length == 0) {
      var kq = {
        'errorCode': 1,
        'message': 'Không tìm thấy'
      }
      res.json(kq)
    }
    else {
      var kq = {
        'errorCode': 0,
        'data':result
      }
      res.json(kq)
    }
  })
});


//lấy loại sản phẩm
router.get('/lay-loai-san-pham', async function (req, res, next) {
  let db = await xl_mongo.Get();
  db.collection(cl_loai_san_pham).find({}).toArray((err, result) => {
    if (result.length == 0) {
      var kq = {
        'errorCode': 1,
        'message': 'Không tìm thấy'
      }
      res.json(kq)
    }
    else {
      var kq={
        'errorCode':0,
        'data':result
      }
      res.json(kq)
    }
  })
});




//lấy danh sách hóa đơn
router.get('/lay-hoa-don', async function (req, res, next) {
  let db = await xl_mongo.Get();
  await db.collection(cl_hoa_don).aggregate([
    {
      $lookup: {
        from: 'nguoi_dung',
        localField: 'khach_hang',
        foreignField: '_id',
        as: 'khach_hang'
      }
    },
    {
      $lookup: {
        from: 'nguoi_dung',
        localField: 'nhan_vien',
        foreignField: '_id',
        as: 'nhan_vien'
      }
    },
    {
      $unwind: {
        path: "$chi_tiet",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "san_pham",
        localField: "chi_tiet.san_pham",
        foreignField: "_id",
        as: "chi_tiet.san_pham"
      }
    },
    {
      $unwind: {
        path: "$chi_tiet.san_pham",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$_id",
        khach_hang: {
          "$first": "$khach_hang"
        },
        ma_hd: {
          "$first": "$ma_hd"
        },
        ngay_lap: {
          "$first": "$ngay_lap"
        },
        nhan_vien: {
          "$first": "$nhan_vien"
        },
        trang_thai: {
          "$first": "$trang_thai"
        },
        ghi_chu: {
          "$first": "$ghi_chu"
        },
        chi_tiet: {
          "$push": "$chi_tiet"
        }
      }
    }
  ]).toArray((err, result) => {
    if (result.length == 0) {
      var kq = {
        'errorCode': 1,
        'message': 'Không tìm thấy'
      }
      res.json(kq)
    }
    else {
      var kq={
        'errorCode':0,
        'data':result
      }
      res.json(kq)
    }
  })
});


//lấy 1 hóa đơn
router.get('/lay-hoa-don/:id', async function (req, res, next) {
  let db = await xl_mongo.Get();
  await db.collection(cl_hoa_don).aggregate([{
    $match: {
      '_id': ObjectId(req.params.id)
    }
  },
  {
    $lookup: {
      from: 'nguoi_dung',
      localField: 'khach_hang',
      foreignField: '_id',
      as: 'khachhang'
    }
  },
  {
    $lookup: {
      from: 'nguoi_dung',
      localField: 'nhan_vien',
      foreignField: '_id',
      as: 'nhanvien'
    }
  }
  ]).toArray((err, result) => {
    if (result.length == 0) {
      var kq = {
        'errorCode': 1,
        'message': 'Không tìm thấy'
      }
      res.json(kq)
    }
    else {
      var kq={
        'errorCode':0,
        'data':result
      }
      res.json(kq)
    }
  })
});

//lấy sản phẩm
router.get('/lay-san-pham', async function (req, res, next) {
  let db = await xl_mongo.Get();
  await db.collection(cl_san_pham).aggregate([
  {
    $lookup: {
      from: 'loai_san_pham',
      localField: 'ma_loai',
      foreignField: '_id',
      as: 'loaisp'
    }
  },
  {
    $lookup: {
      from: 'thuong_hieu',
      localField: 'ma_thuong_hieu',
      foreignField: '_id',
      as: 'thuonghieu'
    }
  }
  ]).toArray((err, result) => {
    if (result.length == 0) {
      var kq = {
        'errorCode': 1,
        'message': 'Không tìm thấy'
      }
      res.json(kq)
    }
    else {
      var kq = {
        'errorCode': 0,
        'message': '',
        'data': result
      }
      res.json(kq)
    }
  })
});

//lấy 1 sản phẩm
router.get('/lay-san-pham/:id', async function (req, res, next) {
  let db = await xl_mongo.Get();
  await db.collection(cl_san_pham).aggregate([{
    $match: {
      '_id': ObjectId(req.params.id)
    }
  },
  {
    $lookup: {
      from: 'loai_san_pham',
      localField: 'ma_loai',
      foreignField: '_id',
      as: 'loaisp'
    }
  },
  {
    $lookup: {
      from: 'thuong_hieu',
      localField: 'ma_thuong_hieu',
      foreignField: '_id',
      as: 'thuonghieu'
    }
  }
  ]).toArray((err, result) => {
    if (result.length == 0) {
      var kq = {
        'errorCode': 1,
        'message': 'Không tìm thấy'
      }
      res.json(kq)
    }
    else {
      var kq = {
        'errorCode': 0,
        'message': '',
        'data': result[0]
      }
      res.json(kq)
    }
  })
});



module.exports = router;