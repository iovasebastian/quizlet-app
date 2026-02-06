import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { LuDot } from "react-icons/lu";
import PreviewSet from "./PreviewSet";
import { IoIosCheckmarkCircle } from "react-icons/io";
import axios from "axios";
import { motion } from "framer-motion";

const MarketplaceCard = ({price, title, difficultyTag, subjectTag, rating, numberOfReviews, items, onPreview, publicSetId, originalSetId}) =>{

    const [setAquired, setSetAquired] = useState(false);
    const baseURL = process.env.REACT_APP_BASE_URL
    const token = localStorage.getItem("token");
    const [privateArray, setPrivateArray] = useState([]);
    const [publicArray, setPublicArray] = useState([]);

    const getSet = async () =>{
        try{
            await axios.post(`${baseURL}/getPublicSet`,{
                publicSetId: publicSetId,
                title: title
            },{
                headers: {Authorization : `Bearer ${token}`}
            })
            setSetAquired(true);
        }catch(error){
            console.error(error);
        }
    }

    const getPersonalSets = async () =>{
        let result;
        try{
            result = await axios.get(`${baseURL}/getTotalSets`,{
                headers: {Authorization : `Bearer ${token}`}
            })
        }catch(error){
            console.error(error);
        }

        let privateArr = [];
        let publicArr = [];

        result?.data.sets.forEach((set)=>{
            if(set.public === 0){
                privateArr.push(set.questionSetId);
            }else{
                publicArr.push(set.publicSetId);
            }
        })
        const uniquePrivate = [...new Set(privateArr)];
        const uniquePublic = [...new Set(publicArr)];

        setPrivateArray(uniquePrivate);
        setPublicArray(uniquePublic);
        checkAquired();
    }

    const checkAquired = () =>{
        console.log('eered', publicArray, privateArray, publicSetId, originalSetId);
        if(publicArray.includes(publicSetId)){console.log('foundDuplicate');setSetAquired(true)};
        if(privateArray.includes(originalSetId))setSetAquired(true);
    }


    useEffect(()=>{
        getPersonalSets();
    },[]);

    useEffect(()=>{
        checkAquired();
    },[privateArray, publicArray]);

    
    const buySet = async () =>{
        try{
            const session = await axios.post(`${baseURL}/create-checkout-session`,{
                setId: publicSetId,
                setName: title,
            },{
                headers: {Authorization : `Bearer ${token}`}
            })

            console.log(session);
            const data = session.data;
            if(data.url){
                window.location.href = data.url;
            }
        }catch(error){
            console.error(error);
        }
    }

    return(
        <>
            <div className="marketplaceCardDiv">
                <div className="marketplaceCardTopLine">
                    <div className="cardTag">{subjectTag}</div>
                    <div className="cardTag">{difficultyTag}</div>
                    <div className={`cardTag ${price == 0 ? 'free' : 'price'}`}>
                        {price == 0 ? 'Free' : `${price} €`}
                    </div>
                </div>
                <h2 className="titleCard">{title}</h2>
                <div className="cardDivDetails">
                    <FaStar/> {rating} ({numberOfReviews})<LuDot/> {items} items
                </div>
                <div className="cardDivButtons">
                    <button onClick = {onPreview} className="buttonPreview">Preview</button>
                    {
                    setAquired
                    ?<motion.div
                        initial={{ scale: 0, opacity: 0, rotate: -45 }}
                        animate={{ scale: [0, 1.3, 1], opacity: 1, rotate: 0 }}
                        transition={{
                            duration: 0.6,
                            ease: "easeOut",
                            times: [0, 0.6, 1]
                        }}
                        >
                        <IoIosCheckmarkCircle style={{ color: "green", fontSize: "2em" }} />
                    </motion.div>
                    :price == 0
                    ?<button onClick = {getSet} className="buttonBuy">Get</button>
                    :<button onClick = {buySet} className="buttonBuy">Buy</button>
                    }
                </div>
            </div>
        </>
    )
}
export default MarketplaceCard;