import { pool } from "../DatabaseConnection.js";
import { addQuotes } from "../Utils/CommonFunctions.js";
import { mccToDatabase } from "../Utils/CommonFunctions.js";

 const downloadExcel=async(req,res)=>{
    const tableName="excel_generator";

    try{
        const {uuid,personid,mcc}=req.query;

        const database= await mccToDatabase(mcc);
        if(!database) throw Error;
        if(!uuid)
        {
            res.json({
                message:"Kindly provide the respective uuid to download your excel file",
                status:400
            })
        }
        else{

        const query=`SELECT * FROM  ${database}.${tableName} WHERE uuid=${addQuotes(uuid)}`;
        const fileRes=await pool.query(query);
        const [file]= fileRes;
        
        if(!(file.personId==personid))
        {
            res.json({
                message:"You are anauthorize to download this file",
                status:404
            })
            return;
        }
        else if(file.uuid!==uuid)
        {
            res.json({
                message:"File did not find",
                status:404
            })
            return;
        }
        
        res.setHeader("Content-Disposition", `attachment;filename=${uuid}.xlsx`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.download(`/fastData/webapps/ExcelDownloaderCron/Downloads/${uuid}.xlsx`);

        }
        }
        catch(err){

             res.setHeader("Content-Type", "application/json");
             res.json({message:"Unable to download the excel",status:400});
             console.log(err);
    
        }
    


}

export default downloadExcel;