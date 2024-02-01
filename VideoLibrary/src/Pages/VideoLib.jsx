import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../confib'; // Assuming 'confib' is a typo, and it should be 'config'
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import "./Homepage.css"

export default function VideoLib() {
    const navigate = useNavigate();
    const [username, setUserName] = useState(localStorage.username || '');
    const [photourl, setPhotourl] = useState(localStorage.logo || '');
    const [videoUpload, setVideoUpload] = useState(null);
    const [videoList, setVideoList] = useState([]);
    const [logoutbool, setLogoutbool] = useState(false);
    const [popup, setPopup] = useState(false);
    const [popupUrl, setPopupUrl] = useState(null);
    const [filterbookmark, setBookmark] = useState(false);
    const [isloading, setIsloading] = useState(0);
    const userVideoRef = ref(storage, `VideoLib/${username}/`);

    useEffect(() => {
        const user = localStorage.username;

        if (user) {
            setUserName(user);
            setPhotourl(localStorage.logo);

            console.log('start listing');

            listAll(userVideoRef)
                .then((res) => {
                    Promise.all(res.items.map((item) => getDownloadURL(item)))
                        .then((urls) => setVideoList(urls))
                        .catch((error) => console.error('Error getting download URLs:', error));
                })
                .catch((error) => console.error('Error listing videos:', error))
                .finally(() => console.log(videoList));
        }
    }, []);
    function handleLogout() {
        localStorage.clear();
        navigate('/');
    }

    const handleUpload = async () => {
        console.log('fun start');

        if (videoUpload != null) {
            console.log('if in');

            const videoRef = ref(storage, `VideoLib/${username}/${videoUpload.name}`);

            uploadBytes(videoRef, videoUpload)
                .then((snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setIsloading(Math.round(progress))
                    alert('Video uploaded');
                    getDownloadURL(snapshot.ref)
                        .then((url) => setVideoList((prev) => [...prev, url]))
                        .catch((error) => console.error('Error getting download URL:', error));
                })
                .catch((error) => console.error('Error uploading video:', error));
        }

        console.log('fun end');
    }
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '99vh',
                padding: '1%',
                boxSizing: 'border-box',
                gap: '1%',
            }}
        >
            <nav
                style={{
                    display: 'flex',
                    width: '100%',
                    border: '2px solid white',
                    borderRadius: '15px',
                    padding: '1%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <span onClick={() => navigate('/')}>Dashboard</span>
                <span
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <h4>Hi {username}</h4>&nbsp;
                    <img
                        onClick={() => setLogoutbool(!logoutbool)}
                        style={{ width: '40px', height: '40px', borderRadius: '10px' }}
                        src={photourl}
                        alt="G"
                    />
                    {logoutbool && (
                        <h4
                            style={{
                                position: 'fixed',
                                zIndex: '2',
                                border: '2px solid white',
                                borderRadius: '10px',
                                top: '9%',
                                right: '2%',
                                backgroundColor: '#242424',
                                padding: '1%',
                            }}
                            onClick={handleLogout}
                        >
                            Logout
                        </h4>
                    )}
                </span>
            </nav>
            <div
            style={{display:'flex',justifyContent:'flex-end',gap:'1%',width:'100%',}}
            >
                <input
                    style={{
                        borderRadius:'5px',cursor:'pointer'
                    }}
                    type="file"
                    onChange={(item) => {
                        setVideoUpload(item.target.files[0]);
                        console.log('itemset');
                    }}
                    placeholder="select your video"
                />
                {
                    isloading>0 && <p>Uploading {isloading} %</p>
                }
                <button
                    style={{
                        borderRadius:'10px',
                        padding: '1%',
                        backgroundColor: '#635994',
                        cursor:'pointer',
                    }}
                    onClick={handleUpload}
                >
                    Add Video
                </button>
                <button
                style={{
                    borderRadius:'10px',
                    padding:'1%',
                    backgroundColor: filterbookmark ? '#635994':'white',
                    cursor:'pointer',
                }}
                >Bookmarked</button>
            </div>
            <div
                className="homepageContent"
                style={{
                    display: 'flex',
                    width: '100%',
                    gap:'1.5%',
                    height: '80%',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    overflowX: videoList.length>3?'scroll':'auto',
                }}
            >
                <div 
                style={popup?{display:'flex',flexDirection:'column',alignSelf:'center',zIndex:'7',position:'fixed',width:'70vw',height:'70vh',border:"2px solid white"}:{display:'none'}}
                className='popup'>
                    <div style={{display:'flex',width:"100%",justifyContent:'space-between',cursor:'pointer'}}>
                        <h5>Name of the video</h5>
                        <h1 style={{color:'red'}} onClick={()=> setPopup(false)}>X</h1>
                    </div> 
                    <iframe src={popupUrl} style={{width:'100%',height:'90%'}} />
                </div>
                {videoList &&
                    videoList.map((video) => (
                        <div 
                        style={{display:'flex',flexDirection:'column',width:'300px',height:'400px',border:'1px solid white',borderRadius:'10px'}}
                        >
                            <video key={video} style={{ width: '300px',maxHeight:'370px'}} src={video} />
                            <div>
                                <button style={{padding:'1%',width:'50%',borderRadius:'10px',cursor:'pointer'}}>
                                    Bookmark
                                </button>
                                <button
                                style={{padding:'1%',backgroundColor:'#635994',width:'50%',borderRadius:'10px',cursor:'pointer'}} onClick={()=>{setPopup(true);setPopupUrl(video)}}
                                >
                                    Play
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
