const getTemplate = (data = [], placeholder, selectedId) => {
    let text = placeholder ?? 'EN'
    const items = data.map(item => {
        let cls = ''
        if(item.id === selectedId){
            text = item.value
            cls = 'select__item-selected'
        }
        return `
            <li class="select__item ${cls}" data-type="item" data-id="${item.id}">${item.value}</li>
        `
    })
    return `
        <div class="select__back-drop" data-type="back-drop"></div>
        <div class="select__input" data-type="input">
            <span data-type="input" data-path="value">${text}</span>
            <i class="fas fa-chevron-down" style="color: #cacaca; font-size: 10px;" data-type="input" data-path="arrow"></i>
        </div>
        <div class="select__dropdown">
            <ul class="select__list">
                ${items.join('')}
            </ul>
        </div>
    `
}

class Select {
    constructor(selector, options){
        this.$el = document.querySelector(selector)
        this.options = options
        this.selectedId = options.selectedId

        this.#render()
        this.#setup()
    }

    #render(){
        const {placeholder, data} = this.options 
        this.$el.classList.add('select')
        this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId)
    }

    #setup(){
        this.clickHandler = this.clickHandler.bind(this)
        this.$el.addEventListener('click', this.clickHandler)
        this.$arrow = this.$el.querySelector('[data-path="arrow"]')
        this.$value = this.$el.querySelector('[data-path="value"]')
    }

    clickHandler(event){
        const {type} = event.target.dataset
        
        if(type === 'input'){
            this.toggle()
        } else if(type === 'item'){
            const id = event.target.dataset.id
            this.select(id)
        } else if(type === 'back-drop'){
            this.close()
        }
    }

    get isOpen(){
        return this.$el.classList.contains('select__open')
    }

    get current(){
        return this.options.data.find(item => item.id === this.selectedId)
    }

    select(id){
        this.selectedId = id
        this.$value.textContent = this.current.value
        this.$el.querySelectorAll('[data-type="item"]').forEach(el => {
            el.classList.remove('select__item-selected')
        })
        this.$el.querySelector(`[data-id="${this.selectedId}"]`).classList.add('select__item-selected')

        this.options.onSelect ? this.options.onSelect(this.current) : null

        this.close()
    }

    toggle(){
        this.isOpen ? this.close() : this.open()
    }

    open(){
        this.$el.classList.add('select__open')
        this.$arrow.classList.remove('fa-chevron-down')
        this.$arrow.classList.add('fa-chevron-up')
    }

    close(){
        this.$el.classList.remove('select__open')
        this.$arrow.classList.remove('fa-chevron-up')
        this.$arrow.classList.add('fa-chevron-down')
    }


    destroy(){
        this.$el.removeEventListener('click', this.clickHandler)
        this.$el.innerHTML = ''
    }
}

const select = new Select('#select', {
    placeholder: 'LN',
    selectedId: '1',
    data: [
        {id: '1', value: 'EN'},
        {id: '2', value: 'RU'}
    ], 
    onSelect(item) {
        console.log('Selected item:', item)
    }
})

window.s = select;