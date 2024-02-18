import { useState, Dispatch, SetStateAction } from 'react'
import { InputForm } from './InputForm'
import { Link, useNavigate } from 'react-router-dom'
import './styles.css'


interface LoginProps {
  settoken: Dispatch<SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ settoken }) => {
  const [ErrorMsg, setErrorMsg] = useState('');
  const [params, setparams] = useState({
    name: '',
    password: '',
    role: ''
  })
  const navigate = useNavigate();
  const handleSubmit = async () => {
    if(!params.name || !params.password){
      setErrorMsg('Please fill all the fields');
      return;
    }
    if (!params.role) {
      setErrorMsg('Please select your Role');
      return;
    }
    setErrorMsg('');
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: params.name, password: params.password, role:params.role})
      })
      const json = await response.json();
      console.log(json);
      if(json.success===true){
        localStorage.setItem('token',json.authToken)
        settoken(true);
        if(json?.role==='user'){
          navigate('/dashboard');
        }
        else
          navigate('/admindashboard');
      }
      else{
        setErrorMsg(json?.error);
      }
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        setErrorMsg(error.message);
      }
    }
  }
  return (
    <div className="main-div" >
      <form className="center-div">
        <h1>Login</h1>
        <InputForm label='User Name' placeholder='Enter your username' type='text'
          onChange={(e) => { setparams((prev) => ({ ...prev, name: e.target.value })) }} />
        <InputForm label='Password' placeholder='Enter your Password' type='password'
          onChange={(e) => { setparams((prev) => ({ ...prev, password: e.target.value })) }} />
        <div style={{fontSize:'15px',width:'80%'}}>
          <label htmlFor="user" style={{display:'inline-block'}}>User</label>
          <input className='radioBtn' type="radio" name="Role" value='user' id="user" style={{height:'10px',margin:'10px',width:'auto',display:'inline-block'}} onChange={() => setparams(prev => ({...prev, role: 'user'}))}/><br/>
          <label htmlFor="admin" style={{display:'inline-block'}}>Admin</label>
          <input className='radioBtn' type="radio" name="Role" value='admin' id="admin" style={{height:'10px',margin:'10px',width:'auto',display:'inline-block'}} onChange={() => setparams(prev => ({...prev, role: 'admin'}))}/>
        </div>
        {ErrorMsg && <p className="ErrorMsg">{ErrorMsg}</p>}
        <button onClick={handleSubmit}>Login</button>
        <p>New User? <span><Link className='footer-link' to='/signup'>Sign Up</Link></span></p>
      </form>
    </div >
  )
}

export default Login