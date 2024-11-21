import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from "./Prayer";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from "axios";
import moment from 'moment'
import "moment/dist/locale/ar-dz"
moment.locale('ar')
  function MainContent() {
    const [nextPrayerIndex,setNextPrayerIndex] =useState(2)
    const [timings,setTimings] = useState({
       
        Fajr: "04:45",
        
        Dhuhr: "12:05",
        Asr: "15:27",
       
        Maghrib: "17:59",
        Isha: "19:16",
       
    
})
const [reminingTime,setRemainingTime] = useState('')
const [selectedCity,setSelectedCity] = useState({
  
    displayName: "القاهرة",
    apiName: 'cairo'    

})
const avilableCities = [{
    displayName: "القاهرة",
    apiName: 'cairo'  
},
{
    displayName: "الجيزة",
    apiName: 'giza'    
},
{
    displayName: "الاسكندرية",
    apiName: 'alexandria'  
}]
const prayersArray = [
    {key : 'Fajr',displayName :'الفجر'},
    {key : 'Dhuhr',displayName :'الظهر'},
    {key : 'Asr',displayName :'العصر'},
    {key : 'Maghrib',displayName :'المغرب'},
    {key : 'Isha',displayName :'العشاء'}
]
const [today,setToday] = useState('');

    const getTimings = async() => {

        const response =await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=EG&city=${selectedCity.apiName}`)
        setTimings(response.data.data.timings)
    }
    useEffect(()=>{

        getTimings();
       
    },[selectedCity])
  useEffect(()=>{
   
    let interval = setInterval(() => {
      setupCountDownTimer()
    }, 1000);
    const t = moment() ;
    setToday(t.format('MMM Do Y | h:mm'))
    return ()=>{
        clearInterval(interval)
    }
  },[timings])
    const setupCountDownTimer = () =>{
       const momentNow = moment();
       let prayerIndex = 1;
       if(momentNow.isAfter(moment(timings['Fajr'],"hh:mm"))&&
       momentNow.isBefore(moment(timings['Dhuhr'],"hh:mm"))) {
        prayerIndex = 1;
       }
       else if(momentNow.isAfter(moment(timings['Dhuhr'],"hh:mm"))&&
       momentNow.isBefore(moment(timings['Asr'],"hh:mm"))) {
        prayerIndex = 2;
       }
       if(momentNow.isAfter(moment(timings['Asr'],"hh:mm"))&&
       momentNow.isBefore(moment(timings['Maghrib'],"hh:mm"))) {
        prayerIndex =3;
       }
       if(momentNow.isAfter(moment(timings['Maghrib'],"hh:mm"))&&
       momentNow.isBefore(moment(timings['Isha'],"hh:mm"))) {
        prayerIndex = 4
       }
       else {
        prayerIndex = 0;
       }
       setNextPrayerIndex(prayerIndex)
       const nextPrayerObject = prayersArray[prayerIndex];
		const nextPrayerTime = timings[nextPrayerObject.key];
		const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

		let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

		if (remainingTime < 0) {
			const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
			const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
				moment("00:00:00", "hh:mm:ss")
			);

			const totalDiffernce = midnightDiff + fajrToMidnightDiff;

			remainingTime = totalDiffernce;
		}
	

		const durationRemainingTime = moment.duration(remainingTime);

		setRemainingTime(
			`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
		);
    
   
    }
    const handleCityChange = (event) => {
        const cityObject = avilableCities.find((city)=>{
            return city.apiName == event.target.value;
        })
        console.log('yes',event.target.value);
        setSelectedCity(cityObject)
      };
  return (
   <>
   <Grid container  >
    <Grid xs={6} >
        <h3>{today}</h3>
        <h2> {selectedCity.displayName}</h2>
        
    </Grid>
    <Grid xs={6} >
        <h3>متبقي حتي صلاة {prayersArray[nextPrayerIndex].displayName}</h3>
        <h2 >{reminingTime}</h2>
    </Grid>

   </Grid>
   <Divider style={{borderColor:'white',opacity:'0.1'}}/>
   <Stack direction={"row"} justifyContent={"space-between"} style={{marginTop:'50px'}}>
    <Prayer name="الفجر"  time={timings.Fajr} image="data:image/jpeg;base64,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"/>
    <Prayer name="الظهر"  time={timings.Dhuhr}image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQogVbdelZ3bxZ5SFGEGE-1SwG0bGpcQdeuXA&usqp=CAU"/>
    <Prayer name="العصر"  time={timings.Asr} image="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYVFRgVFRUYGBgYGhIZGBgYGBgYGBgYGBgZGRgYGBgcIS4lHB4rHxgYJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QHhISHjQhJSE0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIAMIBAwMBIgACEQEDEQH/xAAaAAACAwEBAAAAAAAAAAAAAAADBAABAgUG/8QANBAAAgIABQIFAwIGAgMBAAAAAQIAEQMEEiExQVEFEyJhcYGRoTKxFMHR4fDxBhVCUmIj/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QAIREAAwEAAgMBAQADAAAAAAAAAAERAhIhMUFRAxMiYaH/2gAMAwEAAhEDEQA/APNSASyJBO45SwJtZmaWIBrBxCOOk7HhmG2I27vtuaO/zOJhxnAxWQ2CRM9Zq6Ly4dDNZLEZiFVyt1bWfqfaEXwBito4ZwQNI4I7hjOp/wAe8T1k4bts3egBU6qZFAdOrTfBv8zDW9ZcNFla7PE42VZCVYUVNEbbGLsk9y//AB9C7F2sEEnv9K/eeY8Vy6I5CXp6Xv8AmaY/Ra6I1lo5WmUVjAEy4m1IA6ZQELUyFgIoQ6iDRYbTBjM1KqalRAEwMszkhRZG9bXGcvkSeWVaO4J3+0WRj0mlvvIdKUOpncBEHp9QPXbact2HQTbMSKuAZfeLOZ5DTpTtMkypKmkJpJpVuUBNqImMmiZOGYce06+Qyb1qoD7EyNa4oec08+RM6Z2c9k2BNDn7/Wc3yjdVvDO0w1mAgkrTOnl8gWBJ/wBRZ8MXHzVg+LgChJDaBJCjhxCJAJoiQCamRKliQCaAgBvDhhBKJtYmMaw30/T7z1OR/wCRIgCuNYoC+v8AnSeO1GEBmevzWvJWdNeD1/jPiSMg8piCwGoAnjqCO880z2YNDKYRZys9BrXIP/DHRrsGzQo7j5EXZJEaa8wy1RGsthamAPBIuuQI/wCJeEBD6GLqRfHqHzW0Ty2OUYMuxH5ncwteYGwAHWzM960nfRWUmoeeXD3m2E9PmfB0KB09JFh97Wx7k7ThZjC323jztaFrDQgZkxg4ZomjQ5PaYw8FnICgknbaXUTAYMMvELmMg6GnRh9DRgGhU/A2oUWlPVTBMhMcEVLlTSiMDSLNgSCXckDSz0uQztLThQNqM80DC6vf+ky3nkXnUPYhUdSyiyP3nGfKDWbFHmVkvEgiaQNybnSyOcOIjBk703Su0wjzTarRxsxmL2qgO3Wc3GS22FAz0ieG6jZ2E5+axAjUi3/KVnXfROl0I/wQ7n7STTYmIe8k1/y+h18PNVDPh0AQQfbqPmM4mVrpK/htrh/Rk8EImFQXGPImky8S2N5BeWRyCPkTQWdXJYDccjt0P0nTxfAkbC1o2lwbKMdiL4Er+y9k8H6PMaZoCd8eEnBXzHCuK/TY2s1ZU8iIZnw50AcoQrbg9KPF9vrGtpsl5aFMOW00iyOssQGpLlyjKEaUzpYXiLhNA4HJH4BM5uE4Bv8AkDHsHMepQEDAG6P06fSZ7V9FZ6OsniZdAjgaaAobfU1zBYeaCGgAy3wwE0Mxhsw1JoG+oLe86Iw8q17Ot0QTuPgAcTFxejRV+zn4j4NNt+ogkLsK/wDUDpMJ4iiD/wDNApJ37iuN5HwEtvVQ/wDGwSe9WNv9zlukeUmS20PeJeMvigbaaG9E78cziu8NiRdptnKyuiNab8kuQTMsTQk1UMiTOEsKWkNjBtLQSTaiICASxNCQyRhss6hgWGoDp3j+X8VKLpUdSeO84+qXri1lPyNah6TJ5x3JorxwTzFcXMMWI8r5PH54nOymcCG+T032+0LmPEda1uPg7faZ8Gn0jTl15C2OrAfaVOdqkl8B8isbG8xzpFAmMPhhF5Biy4QXcGZcEzFoqmA1tGUAuKBKj2XMGB0shispGlLHW+Knf1LpVm6jhd6BnIwUJFj6wjYjmgOJk+2Ujor4WCC7trr9CgVQ2/X3hPGc0nl6KLlhVUa2qZfxMYSqCuvbfcituJWS8RdrbQukX6RuQenPTeoK+Q6PL57LMtN5egHijY+u9g/MSae7Xw5Xtr9LDdedyNwanic5WpqFCzQ3/nOn898ujHeYJssGwmyZljN0ZmRCYTbwcJhDeNiGhiR7I58oQTZA3qIjD2ux8dZgzNpPopNo9QM5gYqW2lH32CgA1xvPP453PH04+kWBlO8WcRhrVB4rQJmmMzNkSVNoJmFUQbA2skoTYEkCgJtRKAmgsTYyETJuaCEysQkbHaSEMEzOqZMgMqANoiaTZ9W3wPb3i7TNza4cSUH5Jck1okhRiyYkvVFhClh0hBBtcLh4tRUGaBkvCK5M7GXzpGwMfw8yVIIFkg+4v4nnsN6nRymYI43N8Dk/Ey1j4XnX07eWyL4yk3RELl8k6LXuTzX3lZXxZ8PSmKugEEiq1c7AjkRXxTxgFhosAc2eZjx03C+WTr5bNbMXbRpBLbc0KFfYTxGbPqO97nfv7zrZnxx3QIABzZAst8kzh4jXNvyy8+TPWkwRlGQzNzoTMoWIXCgSZpXoRthBjXNDEij44HFH7wuDmLB1IOBR3BUjr737yG0Uss9K2Xyz4eqwrVxZ5HSeax2FmuJp80KoG4szxZU9g+/RZkmVabWaciYWiwkkkTYQtYbCwyTQBJ9oNRGMN9O4NGS2ECvlGQBmFA8X/TmFRsLSRpLE9SaI26AGvvApqxCSzdtzGMTDRXCFfTv6t79jYO4/rM9a9P8A4aLPwUc6trA01zz9IHFwmB332uxvtNY6i/SfqZsYZOxbaC1A4gcHAZzpUWZs5RgCSCKNcHmGQBN1fe+3HvCf9m4BFg3d2LuU9afgUS8nP0zaISQBydpt81YohfsL+8AuOQbXaV2yehnyiOskV8w95I5ouoSV1PU3fUbV3v8AtCdaBv46/ETRbjIyz1dGZ84PiMAFT6l+hkOOOiDm+v254gLPWzGFxdO1A88jvE9NjWUjKYh4ofbf7zu+C4OJZdNqDeokADbues4axrL5t02ViP2+0GtNCTVHswj0He6azfzzcWxR1jGY8Ud00ubG3FDjqdt4sr2tQzZ2LU9Arl42BoW3tSQCq6eQep3FfmbVCml2VSNjpJHqHut3Ec1mGdiWP9h2A6CGtd9BnP0w2N7TStYuLGWjEcSlr6DyHMwBcPgrq7WATXsBZ/EkryLwB8mbCGq6QgkINXW3F9L7XFxQVgtMsCa+o+4mgm11t3j6F2ZCzYEirNVHRFSwJUbyWV1kjUFoEm/boB1MT1FWEoEbSXcf8P8ADTivp1AAHc8GvYd5M54eFYhDenkEj34Mj+mbCuLEVeoXFzBdrc/YDb4EEMMnpLOCwAJUgG6JG23Mb4sXaDnRsAT7kjb8TDlf368wLOBBYhA4N39D9YkhthWaCbEmGxCYMvNEiWEJg2xe0GzXMGUIJ5hkmZIxkwiBH2z7tsTtx04ib4RBoij2PMyRU42qbnUGaQDZRYHUAgn4nPZxuaF9PaBYyoJQGaXEIjOHmB1Ufm/3ioEIiSuQojoqgNaWBsX2I9j7zLHRuRc6ngPhiYl6mK1XG5vc8fSB8ZyqKwXDcvtuaoX2kf07g+HsQz2afGYuVAJri62FbRTHQX6ewv56xpW07EWBEcR7PFQTHDBEqalaZVFC0YwpxduOn+GCAm6jooY1HrM6pppQWFCEjOWxSl1wwII6EH+nPyIJEjuXwweYnoIWAKsX8GYMYcDgbwyZAldYI3HqF8dv2gv0nkTz8EAIRAbhPJINHaFXDreW3SUodXw/w4NT667gTo/9apVmG3IG4s/J6Tz+GXPpW+9cbdzJj4rgfqsezagPY0dpi8NvyaLSng7uX8NwlGrEdS3IAcV7XPPeJq7OdPqF7adxvvtUSxMX3mXzTBdF7WTXua6/QSlh57tFyvUAO1HeZVxBO9wRmi0S8jDPMxeaGIZa0S8hTKMgkqVSYauSSSFKgLzD3m/MNUTYmQJdTmpqWCJtVEoYcvTFRhESztCJtBLCKjNZ3PeJsaQzg5llOxI+I7l8+q7sNexAU7Cz35sCcmptGHWIBtMZDYcbHquxH8plsrhaSQ+4qhp536HvFnmQ0BjGNl0ABUk2N7AFHsPaLthDpCk7TIMQAvLljDhNM2uGY6KAPJmly57RxMq1XW3fpOrkskqgNq9V7Ajb57SXqBDjYeUbtLdK6T1OfwSUXjqeAu/wJwjl2Y1vEt0bRzwph8PEZeP7Rn+DPaETJ9zXzHyQoCzGaLmyAKHA+l/tMpjmqBNHkf2j3/VAjZt/aos3h1D9Vccx52vAPIbxIDDwxh8O3qcjt0U/Fzg+YRxOn4gABuwZu4uclklZdE1C2xB2/PEE/EJ5ZG5mXa/8qXRACJgxhgJgqIUAFS6htAkXCJ4EdEZUwy4RIvp3Ow+56zIwe8bXKsULEilqh3vtHyguNAjCvpJNrjEbXx7yQ5MfFAxhiZ0wtSaJhTSA5oATXlyKkVHC1WGwxIiToZLIM/6fj6xPQQSzOGAfTxQ+/WAVZ6LG8PdmKMy+mizHYcddovnfBXwxbCxzqHFcXclaQ4crRBaY6mHKxMDePkEF9O0GRHFwtpg4UFoUAIpj7IW0k7cC6oWNv2qDRAIxhYgsXx/9Db8R8mKDmV8JdjTsFHI1WAb/APU1R6T0WDlsJEouTW36SRftOQ/jAoIFAUdE7+xMw3iCEkENp+fV056cyHWPpHWd0dvW1gbKukg9N4RvD1WipIB5J2rsZ59s1qP6jW9ajvNjxM7esiiNtzt37RPIcjuLlcJdi+/OxFVt9uYjmM1gjgXyNjx9a3nJzPiZNA0QOwokf4YkmaoklQbuhvQ7faCz9G2dHM5rD20g/X29pys1nGb/AHAviE3Atc0SSJZl8QmD8ze5p1mSJomKFYuKW5/yoImbKzJEaYoUGlBZpEs1DYiCgADfW46KGFAjmBihdiK7n2igwTzNaz35iboJQcxnS7FE/j88mKvmCTz8ew9oBmmCTBIYSzJMbySgHdM2qQ4wzKozm5GoLTNKkYRfaO5bKE70K95D1Bw5iJHMBynB26+8bbLrv0O21fz6RY4cXKhDt4LJiWwIXjUpNWRwdzFPFwzvbPew2F6QOldKnPKnoK44jX8a4WtbXWnnbT1vuYpGAfw7II4IbUDtT8IB11bTpN/xgsAVcEEWDW37zzuHjOpBDEVR5PSdHK+KlOU1DfbUyjf44jYDGL4JoVhrQke9D81OZiZXRdlCa6MD9djOpkfF9Ab0ephQI0+n6EQWa8TZnD0CV01ddKO9UDCsIcPEwqNGYZo1mCXYsaskk0KG/YQJw5S0JowmMy7qSDuNveZ81u/3/rC+SZDgx8hQXNmSFKSeUYcggAyqjBwD2ljBPYx8ggsUkGHc6Iyfo1c837Dbf8xZdIgtBBc4PtJiZNgLKmOPjdhfvKx8QtyYViOYcEyvJjGID3lKvcx0UArhiGKEe+0hG/P+pvEfewaoVt8VHQFnYn3gTNs0GZaEypZaUZUsRq5JVSQGeyOAFG4lYORDRpmvkTOs/HxPOrOiBMHIoBuB0HvD5jBVwBqAA6ARM4hlq2oe/SIYY5Ra2Iv3gv8ArmugVb4/vBlW5uRcFjC/7CHSy2Dgps5Gqvmj8xfxvFRqASjQPv23PXiXgZF26Tp4fhIK0y7iqsj/AAQTEzyAw4ZUFVW/ftPRt4GgPqah3HftBDww0xUWBVkj9iZXIno4a4M3/DmdzKeHajOrheGaaIC7c6hY+gjzy14BtI8eMmx4Blvk9P6ue09jnsUadK7d6FTgvldRoAn8w044nQz2cVx2EzhpZ3YL7nedTEyxBtkNcDYqIo+D7RchwXOGt7m7BroL6HeM5fNIiUUtu8F5Z6xrDyqFDYNng81BtewgDF8TJBFCj7cRRc2wJ9+0fGCiqbFnoekTCWaAjTQmmLYmKxG3v+YvonTOC3a/qJTZf6HsZa0hNCJy4qwfoYzlsutWSD7ESvLPaETDJOwjbA0/hwrVYo3U5uLgX1nTzOP6QOo/z7Tmu5iy2DREwEW7N9toq6QrMYI3LTJBthzPlxlcMyjhGUtCgDy5nyoz5chWUmID5YkhtMkuih6cXNhIEYkIuJPMejs4hVwYdMuIumIYwmJJeg4jAyqnkmHwsqg/3AI8aw3EVE0N4bAbBeOIdMQ9BFsNhGkMvOiNI0mGbs18UPyZvHwA4okgdhU0pmwZvlrwzB2gsDKhTYJ+sLiE9BcsGWTOhPPGLoXd7Ff4ZTZYXLTLqOABXXrDkyrnPqeB1iONl7O+4+Iri5atgBU6TtAsZi4bZbOU+VXnSAYucIcfM6rgRd0EVNDnvl1P+9vmoJcoojzoIu6w5CgscDnrAvl42xg2aNaCAGwBUzhKR0hS0wWlcg4iOYSydoLyh2jztBNKWiWhF8v7QTYMfYQbCUtEtCJw5WmNlZlklrQuIqVlERgpMlY1omAqkhtMkuj4j4h1lSThZ1IMkZw5JJDGM4cZSSSSDGcOMpJJLyZ6DrDCVJNTDRqXLklIgzBtJJEPIF4B5JJno3yCaAaVJJLBvANJJEUCaCaSSUIE0XaVJKQmYaDkklolmGmDJJKQmUZkySRokyZmSSWgJJJJKA//2Q=="/>
    <Prayer name="المغرب" time={timings.Maghrib} image="data:image/jpeg;base64,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" />
    <Prayer name="العشاء" time={timings.Isha} image="data:image/jpeg;base64,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" />
   
   </Stack>
   <Stack direction={"row"} style={{marginTop:'40px'} } justifyContent='center'>
   <FormControl style={{width:'20%'}}>
        <InputLabel id="demo-simple-select-label">
            {/* <span style={{color:"white"}}>المدينة</span> */}
        </InputLabel>
        <Select
    // style={{color:'white'}}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
        //   value={age}
          label="Age"
          onChange={handleCityChange}
        >
        {avilableCities.map((city)=>{
            return(<MenuItem value={city.apiName} key={city.apiName}>{city.displayName}</MenuItem> );


        })}
          
       
        </Select>
      </FormControl>
   </Stack>
   </>
  )
}
export default MainContent;