document.addEventListener('DOMContentLoaded', () =>{
    /* CHANGE LANGUAGES */

    const items = document.querySelectorAll('.select__item')

    items.forEach(item => {
        item.addEventListener('click', () =>{
            let lng = item.textContent

            changeLanguage(lng)
        })
    })

    function changeLanguage(lng){
        for(let key in langArr){
            let elem = document.querySelector('.lng-' + key)
            if(elem){
                elem.innerHTML = (langArr[key][lng])
            }
        }
    }

    /* ============================================================ */

    const main = document.querySelector('.main')
    const container = document.querySelector('.container');
    const pushContainer = document.querySelector('.push-container')
    const inputCalc = document.getElementById('inputCalc');
    const btnMinus = document.querySelector('.minus');
    btnMinus.disabled = false
    const btnPlus = document.querySelector('.plus');
    btnPlus.disabled = false
    let currentCalc;

    btnMinus.addEventListener('click', inputMinus)
    btnPlus.addEventListener('click', inputPlus)

    function inputMinus(){
        btnPlus.disabled = false
        btnPlus.classList.remove('disabled')

        if(inputCalc.value == 2){
            inputCalc.value = 1
            btnMinus.disabled = true
            btnMinus.classList.add('disabled')
        } else{
            inputCalc.value--
        }

        renderColsFromInput()
        return inputCalc.value
    }

    function inputPlus(){
        btnMinus.disabled = false
        btnMinus.classList.remove('disabled')

        if(inputCalc.value == 7){
            inputCalc.value = 8
            btnPlus.disabled = true
            btnPlus.classList.add('disabled')
        } else{
            inputCalc.value++
        }

        renderColsFromInput()
        return inputCalc.value
    }

    inputCalc.oninput = function() {
        if (this.value.length > 1) {
            this.value = this.value.slice(0,1); 
        }

        if(this.value === '0'){
            this.value = '1';
        }
    }
    
    if(getColorsFromHash().length > 0){
        currentCalc = getColorsFromHash().length
    } else {
        currentCalc = 3
    }

    const pushTextContentEN = 'Color copied to the clipboard!';
    const pushTextContentRU = 'Цвет скопирован в буфер обмена!';

    function createPush(pushTextContent){
        const div = document.createElement('div');
        const tick = document.createElement('i');
        const text = document.createElement('p');

        div.classList.add('copyed-push');
        div.classList.add('push-open');
        tick.classList.add('fa-sharp', 'fa-solid', 'fa-circle-check');
        text.classList.add('lng-push-copied')
        text.textContent = pushTextContent;

        div.append(tick);
        div.append(text);

        pushContainer.append(div);

        return {
            div,
            tick,
            text
        }
    }


    const push = {
        newPush(pushTextContent) {
            pushContainer.style.display = 'flex';
            createPush(pushTextContent)
        },

        removePush(){
            let push = document.querySelector('.copyed-push');

            push.parentNode.removeChild(push.parentNode.firstChild)
        }
    }


    function showCopyed(el){
        el.classList.remove('fa-clone')
        el.classList.add('fa-check') 

        let selectInput = document.querySelector('.select__input')
        let language = selectInput.children[0].textContent

        if(language === 'EN'){
            push.newPush(pushTextContentEN);
        } else if(language === 'RU'){
            push.newPush(pushTextContentRU);
        }

        setTimeout(() => {
            el.classList.remove('fa-check')
            el.classList.add('fa-clone')

            push.removePush()

            let pushArr = document.querySelectorAll('.copyed-push')
            if(pushArr.length < 1){
                pushContainer.style.display = 'none';
            }
        }, 2000)
    }

    function createCols(){
        const column = document.createElement('div');
        const columnContainer = document.createElement('div');
        const columnText = document.createElement('h2');
        const columnClone = document.createElement('i');
        const columnBtn = document.createElement('button');
        const columnLock = document.createElement('i');

        column.classList.add('col');
        columnContainer.classList.add('heading-container')
        columnContainer.dataset.type = 'copy'
        columnText.dataset.type = 'copy'
        columnClone.classList.add('fa', 'fa-clone', 'heading-copy')
        columnClone.dataset.type = 'copy'
        columnClone.ariaHidden = 'true'
        columnBtn.dataset.type = 'lock'
        columnLock.dataset.type = 'lock'
        columnLock.classList.add('fa-solid', 'fa-lock-open');

        columnBtn.append(columnLock);
        columnContainer.append(columnText)
        columnContainer.append(columnClone)
        column.append(columnContainer);
        column.append(columnBtn);

        container.append(column)

        return{
            column,
            columnContainer,
            columnText,
            columnClone,
            columnBtn,
            columnLock
        }
    }

    function checkInputCalcEmpty(){
        if(!inputCalc.value){
            for (let i = 0; i < currentCalc; i++){
                createCols()
            }
        }

        let cols = document.querySelectorAll('.col');
        setRandomColors(false, cols)
    }

    checkInputCalcEmpty()

    function renderColsFromInput(){
        container.innerHTML = '';
        let calc = inputCalc.value
        for (let i = 0; i < calc; i++){
            createCols()
        }

        let cols = document.querySelectorAll('.col');
        setRandomColors(false, cols)

        checkInputCalcEmpty()
    }

    document.addEventListener('keydown', (event) => {
        if(event.code.toLowerCase() === 'space'){
            event.preventDefault()
            const cols = document.querySelectorAll('.col');
            setRandomColors(false, cols)
        }
    })

    document.addEventListener('click', (event) => {
        const type = event.target.dataset.type;
        const clone = document.querySelector('.fa-clone');

        if(type === 'lock'){
            const node = event.target.tagName.toLowerCase() === 'i'
            ? event.target
            : event.target.children[0];

            node.classList.toggle('fa-lock-open');
            node.classList.toggle('fa-lock');
        } else if(type === 'copy'){
            let node = event.target.tagName.toLowerCase() === 'i';
            if(!node){
                copyToClipBoard(event.target.textContent);
            } else{
                copyToClipBoard(event.target.parentElement.textContent);
            }

            if(node){
                showCopyed(event.target)
            } else if(event.target.tagName.toLowerCase() === 'div'){
                showCopyed(event.target.children[1])
            } else {
                showCopyed(event.target.nextSibling)
            }

        } else if(type === 'update'){
            const cols = document.querySelectorAll('.col');
            setRandomColors(false, cols)
        } else if(type === 'clone'){
            const node = event.target.tagName.toLowerCase() === 'div';

            if(node){
                copyToClipBoard(event.target.textContent);
            } else{
                copyToClipBoard(event.target.parentElement.textContent);
            }

            showCopyed(clone)
        }

    })

    let shareBtn = document.querySelector("[data-type='share']")

    const thisTitle = `Coolours App by IvKovalevv 
    github.com/ivkovalevv`
    const thisUrl = window.location.href;

    const shareObj = {
        title: thisTitle,
        url: thisUrl 
    }

    shareBtn.addEventListener('click', async () =>{
        try {
            await navigator.share(shareObj)
            console.log('Всё получилось!')
        } catch(err){
            console.log(err)
        }
    })

    function generateRandomColor(){
        const hexCodes = '0123456789ABCDEF';
        let color = '';

        for (let i = 0; i < 6; i++){
            color += hexCodes[Math.floor(Math.random() * hexCodes.length)]
        }

        return '#' + color
    }

    function copyToClipBoard(text){
        return navigator.clipboard.writeText(text)
    }

    const cols = document.querySelectorAll('.col');

    function setRandomColors(isInitial, cols){
        let allColors = document.querySelector('.all-colors');
        const colors = isInitial ? getColorsFromHash() : [];

        cols.forEach((col, index) => {
            const isLocked = col.querySelector('.fa-solid').classList.contains('fa-lock');
            const text = col.querySelector('h2');
            const clone = col.querySelector('.fa-clone');
            const button = col.querySelector('button');


            const color = isInitial 
            ? colors[index] 
                ? colors[index] 
                : generateRandomColor()
            : generateRandomColor();

            if(!isLocked){
                text.textContent = color;
                col.style.backgroundColor = color;

                if(!isInitial){
                    colors.push(color)
                }

                setTextColor(text, color);
                setTextColor(clone, color);
                setTextColor(button, color);
            } else { 
                colors.push(text.textContent)
                return 
            }
        })

        updateColorsHash(colors)

        allColors.textContent = colors.map(color => ' ' + color)
    }

    function setTextColor(text, color){
        const luminance = chroma(color).luminance();
        text.style.color = luminance > 0.5 ? 'black' : 'white';
    }

    function updateColorsHash(colors = []){
        const colorsString = colors.map(col =>{
            return col.substring(1)
        }).join('-');
        document.location.hash = colorsString;
    }

    function getColorsFromHash(){
        if(document.location.hash.length > 1){
            return document.location.hash
            .substring(1)
            .split('-')
            .map(color => '#' + color)
        } 

        return []
    }

    setRandomColors(true, cols)

});