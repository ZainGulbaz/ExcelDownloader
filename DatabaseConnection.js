import mariadb from "mariadb";

export const pool = mariadb.createPool({
  host: "::1",
  user: "root",
  password: "root",
  connectionLimit: 10,
  port: 3308,
  database: "cemoperator",
  multipleStatements: true,
});

const getConnection = async () => {
  let connection;
  try {
    console.log("Connecting to database...");
    connection = await pool.getConnection();
    console.log(" ");
    console.log("%%%%%%%%%%%%%%%&  Connected to database  %%%%%%%%%%%%%%%&");
    console.log(" ");
  } catch (err) {
    console.log(
      "========================Connection FAILED=========================="
    );
    console.error(err);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export default getConnection;
