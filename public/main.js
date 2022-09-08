const datetimeItem = document.querySelectorAll('#datetime_item');
const datetimeTemplate = document.getElementById('datetime_template').content;
const fragment = document.createDocumentFragment();
const headerTitle = document.querySelectorAll('.datetime__header-title')[0];
// function VUE
const countryList = new Vue({
    el: '#tab__pane--container--listcountry',
    data: {
        selections: [],
        options: [],
        observe: [{
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
        }, {
            timezone: "America/Regina",
            code: 129,
            cca2: "CA",
            CENTER_TIME: 1
        }, {
            timezone: "America/Winnipeg",
            code: 147,
            cca2: "CA",
            CENTER_TIME: 1
        }],


    },
    components: { Multiselect: window.VueMultiselect.default },
    methods: {


        add() {
            // console.log('push de selections',this.selections);
            //availableCoutries.push(this.selections);

            // this.selections.forEach((ver,indice)=>{
            //     probar.push(ver,indice);

            // })
            // if (this.selections == '') {

            //     console.log('esta vacio');
            // } else {               
            //         localStorage.setItem("newTimeZone", JSON.stringify(this.selections));

            // }


            // this.observe.push({
            //     timezone: "America/Caracas",
            //     code: 49,
            //     cca2: 'VE',
            //     CENTER_TIME: 0
            // });

            // for (variable of this.observe) {
            //     console.log(variable);
            // }
            // this.observe = this.observe.concat(this.selections);

            

            // (async () => {
            //     for (let [i, country] of this.observe.entries()) {


            //         console.log(i,country);


            //         let zh = new TimeZone(country);
            //         headerTitle.innerHTML = zh.hoy;
            //         let clone = await zh.printTimeZone(i, country.cca2);
            //         console.log(clone);
            //         fragment.appendChild(clone);
            //         datetimeItem[country.CENTER_TIME].appendChild(fragment);

            //     }
                
            // })();


            // Relaizar push a la tabla
            async function ver(dato) {
              pais = [];
              pais.push(dato);
              console.log('esto es del push',pais[0]);
                for (let [key, value] of pais[0].entries()) {

                    let zh = new TimeZone(value);
                    headerTitle.innerHTML = zh.hoy;
                    let clone = await zh.printTimeZone(key, value.cca2);
                    fragment.appendChild(clone);
                    datetimeItem[value.CENTER_TIME].appendChild(fragment);
                }
                
            }

            ver(this.selections);

            console.log(this.selections)

            

            //guardar los datos en localStorage

             //localStorage.setItem("TimeZone", JSON.stringify(this.selections));
            // dbTimeZone = JSON.parse(localStorage.getItem("TimeZone"));

            //this.observe.push(valores);


            // Filtrar valores para que no se encuentren Repetidos

            // dbTimeZone.forEach((valores,inbdex)=>{
            //     //console.log(valores,inbdex);
            //     console.log(valores);
            //     let letrasUnicas = dbTimeZone.filter((elemento, index) => {
            //         return dbTimeZone.indexOf(elemento) === index;
            //     });

            // });
            // console.log(letrasUnicas);


            //    this.selections = this.selections.concat(this.observe);


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
}, {
    timezone: "America/Regina",
    code: 129,
    cca2: "CA",
    CENTER_TIME: 1
}, {
    timezone: "America/Winnipeg",
    code: 147,
    cca2: "CA",
    CENTER_TIME: 1
}];



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
        //datetimeTemplate.querySelector('.datetime__panel--info img').src = (!auxCca2 ? `https://flagcdn.com/${cca2.toLocaleLowerCase()}.svg` : auxCca2['svg']);
        //datetimeTemplate.querySelector('.datetime__panel--info span').textContent = (cca2 || auxCca2['cca2']);
        datetimeTemplate.querySelector('.datetime__panel--timezone').textContent = timezone.replace(/_/g, ' ');
        setInterval(() => {
            document.querySelectorAll('.datetime__panel--hour')[iterator].innerHTML = this.currentHour(diff);
        }, this.SECONDS)
        return datetimeTemplate.cloneNode(true);
    }
    static async allzonetime() {
        const alltime = await fetch(`https://worldtimeapi.org/api/timezone`);
        let allTimeJson = await alltime.json();
        return allTimeJson;
    }


}


// (async () => {
//     //TODO: Recurso: https://github.com/sanohin/google-timezones-json/blob/master/timezones.json
//     for (let [i, country] of availableCoutries.entries()) {

//         let zh = new TimeZone(country);

//         headerTitle.innerHTML = zh.hoy;
//         let clone = await zh.printTimeZone(i, country.cca2);
//         fragment.appendChild(clone);
//         datetimeItem[country.CENTER_TIME].appendChild(fragment);
//     }
// })();

// (async()=>{
//     this.observe.forEach((valores,index)=>{
//         console.log(valores,index);
//     })
// })





//serch country in timezone


(async () => {
    const countryTime = await TimeZone.allzonetime();
    countryList.options = countryTime
        .map((country, index) => { return { timezone: country, code: index, cca2: " ", CENTER_TIME: 0 } })
        .filter(arr => arr.timezone.search(/Africa|Etc/g) && arr.timezone.split('/').length > 1);
})();

// (async()=>{
//     countryList.selections.forEach((index,elemento)=>{
//         let probar = new TimeZone(buscando);
//     headerTitle.innerHTML = probar.hoy;
//     let copiando = await probar.printTimeZone(index,buscando.cca2);
//     fragment.appendChild(copiando);
//     datetimeItem[buscando.CENTER_TIME].appendChild(fragment);
// })();


// Validar datos anteriores en LocalStorage para mantener los datos en el View

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



// let saveCountry = localStorage.getItem("newTimeZone");
// let loadingCountry = JSON.parse(saveCountry);
// loadingCountry.forEach((valores,index)=>{
//     availableCoutries.push(valores);
// })


