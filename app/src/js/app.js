
require('../styles/style.css')
require('../assets/close.svg')
require('../assets/menu.svg')
require('../assets/logo.svg')
require('../assets/error.svg')

const showMenu = document.getElementById('menuImg')
const hideMenu = document.getElementById('closeMenu')
const addtransactionDivButton = document.getElementById('createTransactionButton')
const addtransactionDivButtonDesktop = document.getElementById('addButton')
const addtransactionDivButtonMobile = document.getElementById('buttonCreateDataMobile')

const deleteTransactionsButtonMobile = document.getElementById('buttonClearMobile')
const deleteTransactionsButtonDesktop = document.getElementById('clearButton')

const inputName = document.getElementById('itemName')
const inputValue = document.getElementById('value')


import { 
    handleOpenMenu, 
    menuOpen, 
    getData, 
    isValidFields, 
    selectValue, 
    selectName, 
    deleteData 
} from './functions.js'

getData()

showMenu.addEventListener('click', menuOpen );
hideMenu.addEventListener('click', handleOpenMenu );

addtransactionDivButton.addEventListener('click', isValidFields);
addtransactionDivButtonDesktop.addEventListener('click', isValidFields);

addtransactionDivButtonMobile.addEventListener('click', handleOpenMenu);
addtransactionDivButtonMobile.addEventListener('click', isValidFields);

inputValue.addEventListener('click', selectValue )

inputName.addEventListener('click', selectName )

deleteTransactionsButtonMobile.addEventListener('click', deleteData)
deleteTransactionsButtonDesktop.addEventListener('click', deleteData)