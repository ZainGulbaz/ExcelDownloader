import mariadb from "mariadb";

export const pool = mariadb.createPool({
  multipleStatements: true,
  host: "localhost",
  socketPath: "/var/lib/mysql/mysql.sock",
  user: "root",
  password: "",
  database: "mycemCommons",
  connectionLimit: 10,
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
