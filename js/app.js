document.addEventListener('DOMContentLoaded', () =>{
    const cols = document.querySelectorAll('.col');

    document.addEventListener('keydown', (event) => {
        event.preventDefault()
        if(event.code.toLowerCase() === 'space'){
            setRandomColors()
        }
    })

    document.addEventListener('click', (event) => {
        const type = event.target.dataset.type;

        if(type === 'lock'){
            const node = event.target.tagName.toLowerCase() === 'i'
            ? event.target
            : event.target.children[0];

            node.classList.toggle('fa-lock-open');
            node.classList.toggle('fa-lock');
        } else if(type === 'copy'){
            copyToClipBoard(event.target.textContent);
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

    function setRandomColors(isInitial){
        const colors = isInitial ? getColorsFromHash() : [];

        cols.forEach((col, index) => {
            const isLocked = col.querySelector('i').classList.contains('fa-lock');
            const text = col.querySelector('h2');
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
                setTextColor(button, color);
            } else { 
                colors.push(text.textContent)
                return 
            }
        })

        updateColorsHash(colors)
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

        console.log(colorsString)
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

    setRandomColors(true)
});