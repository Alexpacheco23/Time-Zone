const datetimeItem = document.querySelectorAll('#datetime_item');
const datetimeTemplate = document.getElementById('datetime_template').content;
const fragment = document.createDocumentFragment();
const headerTitle = document.querySelectorAll('.datetime__header-title')[0];
const countryList = new Vue({

    el: '#tab__pane--container--listcountry',
    data: {
        selections:[],
        options: [],

    },
    components: { Multiselect: window.VueMultiselect.default },
    methods: {
        add() {
            console.log(this.selections);
            if (this.selections == '') {

                console.log('esta vacio');
            } else {               

                console.log(JSON.stringify(this.selections))
                for (let i = 0; i < this.selections.length; i++) {
                    const elemento = this.selections[i];
                    console.log(elemento.timezone.split("/"))
                    fetch(`https://restcountries.com/v3.1/name/${elemento.timezone.split("/")[0]}`).then(e=>e.json()).then(res=>{
                            console.log(res[0].cca2, "respuesta")
                            informacionPaises=res;
                            // this.selections.cca2=res[0].cca2;
                            // localStorage.setItem("newTimeZone", JSON.stringify(this.selections));           

                    })
                    
                }
                
                
            }

        }
    }
});




// Este es un comentario que solo se ve en la rama development

const availableCoutries = [{
    timezone: "America/Santo_Domingo",
    code: 134,
    cca2: 'DO',
    CENTER_TIME: 0
}, {
    timezone: "America/Caracas",
    code: 49,
    cca2: 'VE',
    CENTER_TIME: 0
}, {
    timezone: "America/Lima",
    code: 91,
    cca2: 'PE',
    CENTER_TIME: 0
}, {
    timezone: "America/Chicago",
    code: 51,
    cca2: "US",
    CENTER_TIME: 1
}, {
    timezone: "America/Mexico_City",
    code: 102,
    cca2: "MX",
    CENTER_TIME: 1
},{
    timezone: "America/Regina",
    code: 129,
    cca2: "CA",
    CENTER_TIME: 1
},{
    timezone: "America/Winnipeg",
    code: 147,
    cca2: "CA",
    CENTER_TIME: 1
}]




class TimeZone {

    #__date__ = moment().format('ll');

    constructor({ timezone }) {
        this.SECONDS = 1000;
        this.formatTime = 'hh:mm A';
        this._timezone = timezone;
    }

    get hoy() {
        return this.#__date__;
    }

    async getCurrentHour() {
        let apiTimeZone = await fetch(`https://worldtimeapi.org/api/timezone/${this._timezone}`);
        let { datetime, timezone } = await apiTimeZone.json();
        return {
            diff: this.#getTimeDifference(datetime),
            region: timezone.split('/')[1],
            timezone
        }
    }

    #getTimeDifference(datetime) {
        let myDateTime = moment().format(this.formatTime),
            convertToMoment = moment(datetime.split('.')[0]).format(this.formatTime),
            duration = moment(convertToMoment, this.formatTime).diff(moment(myDateTime, this.formatTime));
        return duration;
    }

    currentHour(diff) {
        let hourCountry = new Date(new Date().getTime() + diff);
        let hour = moment(hourCountry).format(this.formatTime);
        return hour;
    }

    async restCountry(capital) {

        //TODO: Se crea el método por si el valor de cca2 viene null.
        let peticion = await fetch(`https://restcountries.com/v3.1/capital/${capital}`);
        let data = await peticion.json();
        return {
            cca2: data[0].cca2,
            svg: data[0].flags.svg
        }
    }

    async printTimeZone(iterator, cca2) {
        let { diff, region, timezone } = await this.getCurrentHour();
        let auxCca2 = null;
        if (!cca2) auxCca2 = await this.restCountry(region);
        datetimeTemplate.querySelector('.datetime__panel--city').textContent = region.replace(/_/g, ' ');
        datetimeTemplate.querySelector('.datetime__panel--info img').src = (!auxCca2 ? `https://flagcdn.com/${cca2.toLocaleLowerCase()}.svg` : auxCca2['svg']);
        datetimeTemplate.querySelector('.datetime__panel--info span').textContent = (cca2 || auxCca2['cca2']);
        datetimeTemplate.querySelector('.datetime__panel--timezone').textContent = timezone.replace(/_/g, ' ');
        setInterval(() => {
            document.querySelectorAll('.datetime__panel--hour')[iterator].innerHTML = this.currentHour(diff);
        }, this.SECONDS)
        return datetimeTemplate.cloneNode(true);
    }
    static async allzonetime() {
        const alltime = await fetch(`https://worldtimeapi.org/api/timezone`);
        let allTimeJson = await alltime.json();
        return allTimeJson;}
    
    static filterTime(newTime,aldTime){
        //comparar dos localStorage para hacer la union del mismo
    }
    
    }

(async () => {
    //TODO: Recurso: https://github.com/sanohin/google-timezones-json/blob/master/timezones.json
    for (let [i, country] of availableCoutries.entries()) {
       //country.timezone.indexOf('America') >= 0?country.CENTER_TIME = 0 :country.CENTER_TIME = 1;
        let zh = new TimeZone(country);
        headerTitle.innerHTML = zh.hoy;
        let clone = await zh.printTimeZone(i, country.cca2);
        fragment.appendChild(clone);
        datetimeItem[country.CENTER_TIME].appendChild(fragment);
    }
})();
let countryTime;
//serch country in timezone
(async () => {
    countryTime = await TimeZone.allzonetime();
    console.log(countryTime, "countryTime")
    countryList.options = countryTime
        .map((country,index)=>{return { timezone:country,code:index,cca2:"VE", CENTER_TIME: 0 }})
        .filter(arr=>arr.timezone.search(/Africa|Etc/g) && arr.timezone.split('/').length>1);
})();
// if(!localStorage.getItem("oldTimeZone")){
//     localStorage.setItem("oldTimeZone",saveCountry);
// }else{
//     localStorage.getItem("oldTimeZone")===localStorage.getItem("newTimeZone");
//     let newTimeZone = JSON.parse(localStorage.getItem("newTimeZone"));
//     let oldTimeZone = JSON.parse(localStorage.getItem("oldTimeZone"));
//     console.log('newTime',newTimeZone,'y','oldTime',oldTimeZone);
//     let joinTime = oldTimeZone.concat(newTimeZone);
//     let filterTime= new Set(joinTime);
//     console.log(filterTime);
// }

let saveCountry = localStorage.getItem("newTimeZone");
let loadingCountry = JSON.parse(saveCountry);
//console.log(loadingCountry);
// availableCoutries.forEach((valores,index)=>{
//     countryList.selections.push(valores);
//     });
console.log(loadingCountry)
loadingCountry.forEach((element, index) => {
    availableCoutries.push(element);
});




