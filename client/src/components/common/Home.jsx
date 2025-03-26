import { useContext, useEffect, useState } from 'react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Home.css'
function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj)

  const { isSignedIn, user, isLoaded } = useUser()
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // console.log("isSignedIn :", isSignedIn)
   console.log("User :", user)
  // console.log("isLolded :", isLoaded)



  async function onSelectRole(e) {
    //clear error property
    setError('')
    const selectedRole = e.target.value;
    currentUser.role = selectedRole;
    let res = null;
    try {
      if (selectedRole === 'author') {
        res = await axios.post('http://localhost:3000/author-api/author', currentUser)
        let { message, payload } = res.data;
        // console.log(message, payload)
        if (message === 'author') {
          setCurrentUser({ ...currentUser, ...payload })
          //save user to localstorage
          localStorage.setItem("currentuser",JSON.stringify(payload))
          // setError(null)
        } else {
          setError(message);
        }
      }
      if (selectedRole === 'user') {
        console.log(currentUser)
        res = await axios.post('http://localhost:3000/user-api/user', currentUser)
        let { message, payload } = res.data;
        console.log(message)
        if (message === 'user') {
          setCurrentUser({ ...currentUser, ...payload })
           //save user to localstorage
           localStorage.setItem("currentuser",JSON.stringify(payload))
        } else {
          setError(message);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }


  useEffect(() => {
    if (isSignedIn === true) {
      setCurrentUser({
        ...currentUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        profileImageUrl: user.imageUrl,
      });
    }
  }, [isLoaded])



  useEffect(() => {

    if (currentUser?.role === "user" && error.length === 0) {
      navigate(`/user-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "author" && error.length === 0) {
      console.log("first")
      navigate(`/author-profile/${currentUser.email}`);
    }
  }, [currentUser]);

  // console.log("cu",currentUser)
  //console.log("is loaded",isLoaded)

  return (
    <div className='container'>
      {
        isSignedIn === false && <div className="home-section">
        <div className="overlay"></div>
        <div className="content">
          <h1 className="title">Your Blog, Your Voice</h1>
          <p className="description">
            Express yourself with BlogApp—an easy-to-use platform for authors and readers.
            Write, share, and engage with a global audience.
          </p>
          <button className="cta-button">Get Started</button>
        </div>
      </div>
      }

      {
        isSignedIn === true &&
        <div>
          <div className='d-flex justify-content-evenly align-items-center bg-info p-3'>
            <img src={user.imageUrl} width="100px" className='rounded-circle' alt="" />
            <p className="display-6">{user.firstName}</p>
            <p className="lead">{user.emailAddresses[0].emailAddress}</p>
          </div>
          <p className="lead">Select role</p>
          {error.length !== 0 && (
            <p
              className="text-danger fs-5"
              style={{ fontFamily: "sans-serif" }}
            >
              {error}
            </p>
          )}
          <div className='d-flex role-radio py-3 justify-content-center'>

            <div className="form-check me-4">
              <input type="radio" name="role" id="author" value="author" className="form-check-input" onChange={onSelectRole} />
              <label htmlFor="author" className="form-check-label">Author</label>
            </div>
            <div className="form-check">
              <input type="radio" name="role" id="user" value="user" className="form-check-input" onChange={onSelectRole} />
              <label htmlFor="user" className="form-check-label">User</label>
            </div>
          </div>
        </div>



      }
    </div>
  )
}

export default Home