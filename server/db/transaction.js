const db = require(".")  // 导入pool对象
// index.js

// .... 部分创建 pool 的代码

/**
 * mysql 事务处理
 * @param {Array} sqls 需要执行的sql语句
 * @param {Array} params 对应上面sql语句的参数
 * @returns {Promise} 返回一个Promise
 */
 function transaction(sqls, params) {
    return new Promise((resolve, reject) => {
      db.getConnection(function (err, connection) {
        // 连接失败 promise直接返回失败
        if (err) { return reject(err);}
        // 如果 语句和参数数量不匹配 promise直接返回失败
        // if (sqls.length !== params.length) {
        //   connection.release(); // 释放掉
        //   return reject(new Error("语句与传值不匹配"));
        // }
        // 开始执行事务
        connection.beginTransaction((beginErr) => {
          // 创建事务失败
          if (beginErr) {
            connection.release();
            return reject(beginErr);
          }
          // console.log("开始执行事务，共执行" + sqls.length + "条语句");
          // 返回一个promise 数组
          let funcAry = sqls.map((sql, index) => {
            return new Promise((sqlResolve, sqlReject) => {
              // const data = params[index];
              console.log('sql---',sql);
              connection.query(sql, (sqlErr, result) => {
                console.log(result);
                if (sqlErr ||  JSON.parse(JSON.stringify(result) ).affectedRows==0 ) {
                  if (JSON.parse(JSON.stringify(result) ).affectedRows==0) {
                    sqlErr='库存不足！'
                    }
                    console.log(sqlErr);
                  return sqlReject(sqlErr);
                }
                console.log('sql+++',sql)
                sqlResolve(result);
              });
            });
          });
          // 使用all 方法 对里面的每个promise执行的状态 检查
          Promise.all(funcAry)
            .then((arrResult) => {
              // 若每个sql语句都执行成功了 才会走到这里 在这里需要提交事务，前面的sql执行才会生效
              // 提交事务
              console.log('提交事务');
              connection.commit(function (commitErr, info) {
                if (commitErr) {
                  // 提交事务失败了
                  console.log("提交事务失败:" + commitErr);
                  // 事务回滚，之前运行的sql语句不生效
                  connection.rollback(function (err) {
                    if (err) console.log("回滚失败：" + err);
                    connection.release();
                  });
                  // 返回promise失败状态
                  return reject(commitErr);
                }
                
                connection.release();
                // 事务成功 返回 每个sql运行的结果 是个数组结构
                resolve(arrResult);
              });
            })
            .catch((error) => {
              console.log('promise.all.catch');
              // 多条sql语句执行中 其中有一条报错 直接回滚
              connection.rollback(function () {
                console.log("sql运行失败： " + error);
                connection.release();
                reject(error);
              });
            });
        });
      });
    });
  }

  module.exports = {
    transaction,
  };
  