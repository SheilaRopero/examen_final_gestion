import { Router } from "express";
import { MongoClient } from "mongodb";
const route = Router();
const client = new MongoClient("mongodb://localhost:27017");

const connection  = async () => {
    try{
        await client.connect();
        return client.db("torneo");
    }catch(ex){
        console.log(ex);
    }
}

route.get("/", async (req, res ) => {
    const conn = await connection();
    const resul = await conn.collection("tournament").find({}).toArray();
    console.log(resul);
    res.send(resul);
})

route.post("/", async (req, res ) => {
    const conn = await connection();
    const resutlt = await conn.collection("tournament")
    .insertOne(req.body);
    res.send(resutlt);
})
route.post("/many", async (req, res ) => {
    const conn = await connection();
    const resutlt = await conn.collection("tournament")
    .insertMany(req.body);
    res.send(resutlt);
})

route.get("/filter", async (req, res ) => {
    const conn = await connection();
    const resutlt = await conn.collection("tournament")
    .find({
        "status" : { "$exists": false }
    }).toArray();
    res.send(resutlt);
})

route.get("/filters", async (req,res) => {
    // { name : value }
    let data = req.query;
    if(data.length === 0){ return res.send([])}
    if(typeof data.year !== "undefined"){
        data.year = parseInt(data.year)
    }
    const conn = await connection();
    const resutlt = await conn.collection("tournament")
    .find(data).toArray();
    res.send(resutlt);

})



export default route;