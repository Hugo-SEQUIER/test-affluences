import axios, { AxiosResponse } from 'axios';
import dateFormat from 'dateformat'

async function getTimetable(datetime : any): Promise<any> {
    const res = await axios.get("http://localhost:8080/timetables", {
        data: {
            date: datetime,
            resourceId: 1337
        }
    });
    const res_1 = res.data();
    return res_1;
}

async function getReservation(datetime : any): Promise<any> {
    const res = await axios.get("http://localhost:8080/reservations", {
        data: {
            date: datetime,
            resourceId: 1337
        }
    });
    const res_1 = res.data();
    return res_1;
}

export const endRest = async (datetime : string) => {
    // if (!isNan(new Date(datetime)))
    let date = new Date(datetime);
    let time = date.getTime();
    let schedule: any = getTimetable(dateFormat(datetime, "yyyy-mm-dd"));
    if (schedule.open === "true"){
        let timetables = schedule.timetables;
        let correctSlice : boolean = false;
        for (let idxTimeTable =0; idxTimeTable < timetables.length; idxTimeTable++){
            let dateStart = new Date(timetables[idxTimeTable].opening).getTime();
            let dateEnd = new Date(timetables[idxTimeTable].closing).getTime();
            if (time >= dateStart && time <= dateEnd) correctSlice = true;
        }
        let creneauValide = false;
        if (correctSlice){
            let reservations: any = getReservation(dateFormat(datetime, "yyyy-mm-dd"));
            let tabRes = reservations.reservations;
            for (let idxReservation = 0; idxReservation < tabRes.length; idxReservation++){
                let dateStart = new Date(tabRes[idxReservation].reservationStart).getTime();
                let dateEnd = new Date(tabRes[idxReservation].reservationEnd).getTime();
                if (idxReservation === 0){
                    if (time < dateStart){
                        creneauValide = true;
                    }
                }
                else if (idxReservation === tabRes.length - 1){
                    if (time > dateEnd){
                        creneauValide = true;
                    }
                }
                else {
                    dateEnd = new Date(tabRes[idxReservation - 1].reservationEnd).getTime();
                    if (time > dateEnd && time < dateStart){
                        creneauValide = true;
                    }
                }
            }
        }
        let response: any = {
            "available" : creneauValide
        };
        return <JSON>response;
    }
    let response: any = {
        "available" : false
    };
    return <JSON>response;
}

