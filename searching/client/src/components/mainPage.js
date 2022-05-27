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
            try {
                try {
                 var isExist = await axios.get('http://localhost:8000/getMovie')
                 var alreadyThere = false;
                 for(let i = 0; i < isExist.data.length; i++) {
                     if(event.target.value.toString().toLowerCase() === isExist.data[i].title.toString().toLowerCase()) {
                         alreadyThere = true;
                         setDbMovie(isExist.data[i]);
                         break;
                     }
                 }
                }
                catch(e) {
                    console.log(e);
                }

                const response = await fetch(url);
                data = await response.json();
                setMovie(data)
                if(data.Response === "False") {
                    setError("Movie not found!")
                }
                else {
                    if(alreadyThere === false) {
                        let m = {
                            title: data.Title,
                        }
                        await axios.post('http://localhost:8000/addMovie', m);
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
        if(m !== null) {
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
        if(m !== null) {
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
                                <span className = {movie.Response === 'False' ? styles.invis : styles.upVote} onClick = {(e) => handlerForUpVote(e,movie)}>&#x2191; {dbMovie.likes}</span>
                                <span className = {movie.Response === 'False' ? styles.invis : styles.downVote} onClick = {(e) => handlerForDownVote(e,movie)}>&#8595; {dbMovie.dislikes}</span>
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