document.addEventListener('DOMContentLoaded', () =>{
    const main = document.querySelector('.main')
    const container = document.querySelector('.container');
    const inputCalc = document.getElementById('inputCalc');
    let currentCalc;

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
    } else {currentCalc = 3}

    function createPush(){
        const div = document.createElement('div');
        const tick = document.createElement('i');
        const text = document.createElement('p');

        div.classList.add('copyed-push');
        tick.classList.add('fa-sharp', 'fa-solid', 'fa-circle-check');
        text.textContent = 'Color copied to the clipboard!';

        div.append(tick);
        div.append(text);

        main.append(div);

        return {
            div,
            tick,
            text
        }
    }

    function showCopyed(el){
        el.classList.remove('fa-clone')
        el.classList.add('fa-check')
        createPush()

        setTimeout(() => {
            el.classList.remove('fa-check')
            el.classList.add('fa-clone')

            document.querySelectorAll('.copyed-push').forEach(el =>{
                el.classList.add('push-close');
            })
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

    inputCalc.addEventListener('input', renderColsFromInput)

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
        }else if(type === 'clone'){
            const node = event.target.tagName.toLowerCase() === 'div';

            if(node){
                copyToClipBoard(event.target.textContent);
            } else{
                copyToClipBoard(event.target.parentElement.textContent);
            }

            showCopyed(clone)
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

        allColors.textContent = 'All colors: ' + colors.map(color => ' ' + color)
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