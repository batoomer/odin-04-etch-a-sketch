const displayController = (()=>{
    const gridContainer = document.querySelector('.grid-container');
    const paintButton = document.querySelector('.paint-btn');
    const eraseButton = document.querySelector('.erase-btn');
    const rainbowButton = document.querySelector('.rainbow-btn');
    const borderButton = document.querySelector('.border-btn');
    const gridSizeSlider = document.querySelector('.grid-size-slider');
    const gridSliderText = document.querySelector('.size-option > small');
    const colorInput = document.querySelector('.paint-color');
    const clearButton = document.querySelector('.clear-grid');
    const burgerButton = document.querySelector('.menu-wrapper');
    const headerMenu = document.querySelector('header');
    
    let gridItemSet = document.querySelectorAll('.grid-item');
    let gridSize = 16;
    let borderState = true;
    let mouseClicked = false;
    let paintMode = 'paint';
    let color = '#000000';
    let menuFlag = false;

    function setGridContainerStyle(gridSize){
        const style = `
        display:grid;
        grid-template-columns: repeat(${gridSize}, 1fr);
        grid-template-rows: repeat(${gridSize}, 1fr);
        `
        gridContainer.setAttribute('style', style);
    };

    function createGrid(gridSize){
        setGridContainerStyle(gridSize)
        //Create the grid 
        for (let i=0; i<gridSize; i++){
            for(let j=0; j<gridSize; j++){
                const gridItem = document.createElement('div')
                gridItem.classList.add('grid-item');
                if (borderState){
                    gridItem.classList.add('grid-item-border');
                };
               
                gridContainer.appendChild(gridItem);
            };
        };
        gridItemSet = document.querySelectorAll('.grid-item');
        addGridDisplayEventListeners();
    };

    function clearGrid(){
        gridContainer.innerHTML='';
    };

    function resetGrid(){
        clearGrid();
        createGrid(gridSize);
    }

    // Color Input 
    
    function handleColorInput(val){
        color = val;
    };

    // Paint mode select
    function handlePaintMode(mode){
        paintMode = mode;
        if (paintMode === 'paint'){
            paintButton.classList.add('active-mode');
            eraseButton.classList.remove('active-mode');
            rainbowButton.classList.remove('active-mode');
        } else if (paintMode === 'erase'){
            paintButton.classList.remove('active-mode');
            eraseButton.classList.add('active-mode');
            rainbowButton.classList.remove('active-mode');
        }else if (paintMode === 'rainbow'){
            paintButton.classList.remove('active-mode');
            eraseButton.classList.remove('active-mode');
            rainbowButton.classList.add('active-mode');
        };
    }

    // toogle borders on off
    function toogleBorders(){
        // If borders -> disable 
        if (borderState) {
            gridContainer.classList.remove('grid-border');
            gridItemSet.forEach(gridItem => gridItem.classList.remove('grid-item-border'));
            borderState = false;
            borderButton.classList.remove('active-mode');
        } else {
            gridContainer.classList.add('grid-border');
            gridItemSet.forEach(gridItem => gridItem.classList.add('grid-item-border'));
            borderState = true;
            borderButton.classList.add('active-mode');
        };
    };

    // updates slider text 
    function updateSliderText(value){
        gridSliderText.textContent = `${value}x${value}`;
    }


    //Paint
    function randomHexColor(){
        const hexChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9','A','B', 'C', 'D', 'E', 'F'];
        let hexCode = '#';
        for (let i=0; i< 6; i++){
            let index = Math.floor(Math.random() * hexChar.length -1);
            hexCode += hexChar[index];
        };
        return hexCode;
    };

    function paintGridItem(e){
        if (e.type === 'mouseover' && !mouseClicked) return;
         
        if (paintMode === 'paint'){
            e.target.style.backgroundColor = color;
        } else if (paintMode === 'erase'){
            e.target.style.backgroundColor = '';
        } else if (paintMode === 'rainbow'){
            e.target.style.backgroundColor = randomHexColor();
        };
    };

    function handleMenu(){
        if (menuFlag) {
            headerMenu.classList.remove('active-display');
            burgerButton.style.backgroundColor = '#eeeeee';
            menuFlag = false;
        }else {
            headerMenu.classList.add('active-display');
            menuFlag = true;
            burgerButton.style.backgroundColor = 'white';
        }
    }


    function addOptionMenuEventListeners(){
        //Grid Slider Size Listeners
        gridSizeSlider.addEventListener('input', (e) => {
            updateSliderText(e.target.value);
        });
        gridSizeSlider.addEventListener('change', (e) => {
            gridSize = e.target.value;
            updateSliderText(gridSize);
            resetGrid();
        })

        //Toogle Border Listeners
        borderButton.addEventListener('click', () => toogleBorders());

        //Paint Mode Button
        paintButton.addEventListener('click', () => handlePaintMode('paint'));
        eraseButton.addEventListener('click', () => handlePaintMode('erase'));
        rainbowButton.addEventListener('click', () => handlePaintMode('rainbow'));

        // Color Input
        colorInput.addEventListener('input', (e) => {handleColorInput(e.target.value)});

        // Clear Grid
        clearButton.addEventListener('click', () => {resetGrid()});

        // Burger Button 
        burgerButton.addEventListener('click', () => {handleMenu()})
    };

    function addGridDisplayEventListeners(){
        //Grid Container Listener
        gridContainer.addEventListener('mousedown', () => {mouseClicked=true});
        gridContainer.addEventListener('mouseup', () => {mouseClicked=false});
        gridContainer.addEventListener('mouseleave', () => {mouseClicked=false});
        
        //Grid Item Listeners
        gridItemSet.forEach(
            gridItem => gridItem.addEventListener('mousedown', (e) => paintGridItem(e))
        );
        gridItemSet.forEach(
            gridItem => gridItem.addEventListener('mouseover', (e) => paintGridItem(e))
        );
    };

    return {
        createGrid,
        addOptionMenuEventListeners
    }
})();

//initialize
displayController.createGrid(16);
displayController.addOptionMenuEventListeners();