import './marketplace.css';
import RequireAuth from '../RequireAuth/RequireAuth';
import UploadMenu from './UploadMenu';
import PreviewSet from './PreviewSet';
import { IoIosSearch } from "react-icons/io";
import MarketplaceCard from './MarketplaceCard';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Marketplace = () =>{

    const [searchText, setSearchText] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("");
    const [costFilter, setCostFilter] = useState("");
    const [uploadMenuVisibility, setUploadMenuVisibility] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const knownSubjects = ["Computer Science"];
    const [questionSets, setQuestionSets] = useState([]);
    const [idOfQuestionSets, setIdOfQuestionSets] = useState([]);
    const [previewSetId, setPreviewSetId] = useState(null);
    const token = localStorage.getItem("token");

    const baseURL = process.env.REACT_APP_BASE_URL
    const fetchQuestionSets = async () =>{
        try{
            const response = await axios.get(`${baseURL}/getPublicSets`, {
                headers: {Authorization : `Bearer ${token}`}
            });
            setQuestionSets(response.data.questionSets);
        }catch(error){
            console.error(error);
        }
    }

    useEffect(()=>{
        fetchQuestionSets();
    },[])

    useEffect(()=>{
        setIdOfQuestionSets(questionSets.map(item => item.originalSetId));
        console.log(idOfQuestionSets);
        console.log(questionSets)
    },[questionSets])

    const changeSearchText = (e) =>{
        setSearchText(e.target.value);
    }

    const uploadMenuPopup = () =>{
        setUploadMenuVisibility(prev => !prev);
    }

    const openPreviewFor = (id) => {
        setPreviewSetId(id);
        setPreviewOpen(true);
    };

    const previewSetPopup = () =>{
        setPreviewOpen(prev => !prev);
    }

    return(
        <>
        <RequireAuth />
        <div className='background'>
            <div className='marketplaceDiv glass'>
                <div className='topMarketPlace'>
                    <h1 className='titleMarketplace'>Marketplace</h1>
                    <div className='buttonSection'>
                        <button onClick = {uploadMenuPopup} className='buttonFinal buttonMarketplace'>Upload Set</button>
                    </div>        
                </div>
                <div className='filterBar'>
                    <div className='inputDiv'>
                        <div className='iconSearch'><IoIosSearch /></div>
                        <input type='text' value={searchText} onChange={changeSearchText} placeholder='Search sets, tags, subjects'/>
                    </div>
                    <div className='filtersDiv'>
                        <div className='individualFilterDiv'>
                            <label>Subject</label>
                            <select value = {subjectFilter} onChange = {(e) => setSubjectFilter(e.target.value)} className='filter subject'>
                                <option value="" selected>All</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className='individualFilterDiv'>
                            <label>Level</label>
                            <select value = {difficultyFilter} onChange = {(e) => setDifficultyFilter(e.target.value)} className='filter subject'>
                                <option value="" selected>All</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        <div value = {costFilter} onChange = {(e) => setCostFilter(e.target.value)} className='individualFilterDiv'>
                            <label>Cost</label>
                            <select className='filter subject'>
                                <option value= "" selected>All</option>
                                <option value={0}>Free</option>
                                <option value={1}>Paid</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='marketplaceCardsSpace'>
                    {questionSets
                    //fileter searchBox
                    .filter((questionSet) => 
                        (questionSet.title.toLowerCase().includes(searchText.toLowerCase())) ||
                        (questionSet.subject.toLowerCase().includes(searchText.toLowerCase())) ||
                        (questionSet.difficulty.toLocaleLowerCase().includes(searchText.toLowerCase()))
                    )
                    //filter dropboxes
                    .filter((set) =>
                        subjectFilter === ""
                        ? true
                        : subjectFilter !== "Other"
                        ? set.subject.toLowerCase().includes(subjectFilter.toLowerCase())
                        : !knownSubjects.map(s => s.toLowerCase()).includes(set.subject.toLowerCase())
                    )
                    .filter((set)=>
                        difficultyFilter === ""
                        ? true
                        : set.difficulty.toLowerCase().includes(difficultyFilter.toLowerCase())
                    )
                    .filter((set)=>
                        costFilter === ""
                        ? true
                        : costFilter > 0
                        ? set.price > 0
                        : set.price === 0
                    )
                    .map((items) =>(
                        <MarketplaceCard
                            key={items.publicSetId}
                            price={items.price}
                            title={items.title}
                            difficultyTag={items.difficulty}
                            subjectTag={items.subject}
                            rating={items.rating || "0"}
                            numberOfReviews={items.numberOfReviews || "none"}
                            items={items.itemNumber}
                            onPreview={() => openPreviewFor(items.publicSetId)}
                            publicSetId={items.publicSetId}
                            originalSetId = {items.originalSetId}
                        />
                    ))}
                </div>
            </div>
            {uploadMenuVisibility&&
                <UploadMenu onClose = {uploadMenuPopup} idOfQuestionSets = {idOfQuestionSets}/>
            }
            {previewOpen && (
                <PreviewSet onClose={previewSetPopup} setId={previewSetId} />
            )}
        </div>
        </>
    );
}
export default Marketplace;