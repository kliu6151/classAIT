import React, {useState} from "react";
import styles from './mainPage.module.css'
import axios from 'axios';


function MainPage() {
    const [movie, setMovie] = useState({});
    const [error, setError] = useState(' ');
    const [dbMovie, setDbMovie] = useState({});
    var data = {};

    const onEnter = async (event) => {
        if(event.charCode === 13) { 
            const key = "9df453a9"
            const url = `http://www.omdbapi.com/?t=${event.target.value}&apikey=${key}`;
            var isExist = await axios.get('http://localhost:8000/getMovie')
            try {
                var alreadyThere = false;
                const response = await fetch(url);
                data = await response.json();
                setMovie(data)

                let existing = isExist.data.filter(e => e.title === data.Title)
                if(existing.length !== 0) {
                    if(data.Title === existing[0].title) {
                        alreadyThere = true;
                        setDbMovie(existing[0]);
                    } 
                }
                if(data.Response === "False") {
                    setError("Movie not found!")
                }
                else {
                    if(alreadyThere === false) {
                        let m = {
                            title: data.Title,
                            likes: 0,
                            dislikes: 0
                        }
                        await axios.post('http://localhost:8000/addMovie', m);
                        setDbMovie(m);
                        
                    }
                    setError("");
                }
              } catch (e) {
                  setError(e)
              } 
        }
    }

    const handlerForUpVote = async(event,m) => {
        event.preventDefault();
        if(m.Title !== undefined) {
            const mov = await axios.get('http://localhost:8000/getMovie', m)
            for(let i = 0; i < mov.data.length; i++) {
                if(m.Title.toString().toLowerCase() === mov.data[i].title.toString().toLowerCase()) {
                    var upd = mov.data[i];
                    break;
                }
            }
            await axios.put('http://localhost:8000/updateLikesMovie', upd);
            upd.likes++;
            setDbMovie(upd);
        }

    }

    const handlerForDownVote = async(event,m) => {
        event.preventDefault();
        if(m.Title !== undefined) {
            const mov = await axios.get('http://localhost:8000/getMovie', m)
            for(let i = 0; i < mov.data.length; i++) {
                if(m.Title.toString().toLowerCase() === mov.data[i].title.toString().toLowerCase()) {
                    var upd = mov.data[i];
                    break;
                }
            }
            await axios.put('http://localhost:8000/updateDisLikesMovie', upd);
            upd.dislikes++;
            setDbMovie(upd);
        }
    }

            return (
                <div>
                    <nav>
                        <h1 className={styles.title}>Searching</h1> 
                        <div className={styles.search}>
                            <input  type = "text" placeholder="Search ..." name="search" onKeyPress = {onEnter} />
                        </div>
                        <content className={styles.allContent}>
                            <span className={styles.votes}>
                                <span className = {movie.Title === undefined ? styles.invis : styles.upVote} onClick = {(e) => handlerForUpVote(e,movie)}>&#x2191; {dbMovie.likes}</span>
                                <span className = {movie.Title === undefined ? styles.invis : styles.downVote} onClick = {(e) => handlerForDownVote(e,movie)}>&#8595; {dbMovie.dislikes}</span>
                            </span>    
                                <img className = {styles.picture} src = {movie.Poster}  alt = ""/>
                            <span className={styles.infor}>
                                <h1 className= {styles.Mtitle}>{movie.Title}</h1>
                                <p className= {styles.desc}> {movie.Plot}</p>
                            </span>
                                <h4 className= {styles.err}>{error}</h4>
                            
                        </content>
                    </nav>

                </div>
            )
}

export default MainPage;