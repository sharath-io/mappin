import Pin from "../models/Pin.js";

// get all pins 
export const getAllPins = async (req,res) =>{
    try{
        const pins = await Pin.find();
        res.status(200).json(pins);
    }catch(error){
        console.error("Error in getting all the pins", error);
        res.status(500).json({message:"Internal server error"})
    }
}

// create a pins
export const createPin = async (req,res) =>{
    try{
       const {username,title,desc,rating,lat,long} = req.body;
       const pin = new Pin({username,title,desc,rating,lat,long});
       const savedPin = await pin.save();
       res.status(201).json(savedPin);

    }catch(error){
        console.error("Error in creating new pin", error);
        res.status(500).json({message:"Internal server error"})
    }
}