//hello you!!
let baseAttributes = new TypeAttributes();
let domNetwork = [];
let auxNetwork = [];
let tertNetwork = [];
let infNetwork = [];

let error = '';

function CogStack(dom, auth, aux, opp) {
    this.dom = dom;
    this.auth = auth;
    this.aux = aux;
    this.opp = opp;
}

function TypeAttributes(IE, LC, NS, FT) {
    this.IE = IE; //introverted/extraverted
    this.LC = LC; //lens/codec dom
    this.NS = NS; //intuitive/sensing conv
    this.FT = FT; //feeling/thinking conv
}

function handleSubmit(type){
    if (type.match(/^[IE][NS][FT][PJ]$/g)) {
        populateValues(type);
        populateDisplay();
    } else {
        //is this form validation?
        console.log('Please enter a valid 4 letter type code.')
    }
}

function populateValues(type) {
    baseAttributes = parseType(type);
    let defaultType = getCogStack(baseAttributes.IE, baseAttributes.LC, baseAttributes.NS, baseAttributes.FT);
    domNetwork = getDominantNetworks(baseAttributes.IE, baseAttributes.LC, baseAttributes.NS, baseAttributes.FT);
    auxNetwork = getAuxiliaryNetworks(domNetwork[1]);
    tertNetwork = getAuxiliaryNetworks(domNetwork[2]);
    infNetwork = getInferiorNetworks(domNetwork[3]);
}

//code -> attributes
function parseType(type) {
    let typeAttr = new TypeAttributes();
    let l1 = type.charAt(0);
    let l2 = type.charAt(1);
    let l3 = type.charAt(2);
    let l4 = type.charAt(3);
    typeAttr.IE = l1 == 'I' ? true : false;
    typeAttr.LC = ((typeAttr.IE && l4 === 'J') || (!typeAttr.IE && l4 === 'P')) ? true : false;
    typeAttr.NS = ((typeAttr.LC && l2 === 'N') || (!typeAttr.LC && l2 === 'S')) ? true : false;
    typeAttr.FT = ((typeAttr.LC && l3 === 'T') || (!typeAttr.LC && l3 === 'F')) ? true : false;
    return typeAttr;
}

//functons -> code
function serializeType(type){
    let l1 = '';
    let l2 = '';
    let l3 = '';
    let l4 = '';
    l1 = type.dom.charAt(1) === 'e' ? 'E' : 'I';
    l4 = l1 === 'E' && type.dom.charAt(0);
    if(type.auth.charAt(0) === 'F' || type.auth.charAt(0) === 'T'){
        l2 = type.dom.charAt(0);
        l3 = type.auth.charAt(0);
        l4 = l1 === 'E' ? 'P' : 'J';
    } else {
        l2 = type.auth.charAt(0);
        l3 = type.dom.charAt(0);
        l4 = l1 === 'I' ? 'P' : 'J';
    }

    return l1+l2+l3+l4;
}

//hehe
function functionFunction(IE, LC, NS, FT) {
    console.log('functionFunction');
    console.log(IE, LC, NS, FT);
    console.log((LC ? (NS ? 'N' : 'S') : (FT ? 'F' : 'T')) + (IE ? 'i' : 'e'));
    return (LC ? (NS ? 'N' : 'S') : (FT ? 'F' : 'T')) + (IE ? 'i' : 'e');
}

//not working for INTJ / ENTP / ESFJ / ISFP
function getCogStack(IE, LC, NS, FT) {
    const newStack = new CogStack();
    console.log('f: ' + FT); //feeling typing not correct
    newStack.dom = functionFunction(IE, LC, NS, FT);
    newStack.auth = functionFunction(!IE, !LC, !NS, !FT);
    newStack.aux = functionFunction(IE, !LC, NS, FT);
    newStack.opp = functionFunction(!IE, LC, !NS, !FT);

    return newStack;
}

function getDominantNetworks(IE, LC, NS, FT) {
    let networks = [];
    networks.push(getCogStack(IE, LC, NS, FT)); //dom
    networks.push(getCogStack(!IE, LC, NS, FT));
    networks.push(getCogStack(IE, LC, !NS, !FT));
    networks.push(getCogStack(!IE, LC, !NS, !FT));

    return networks;
}

function getAuxiliaryNetworks(type) {
    let typeAttr = (parseType(serializeType(type))); //why did I design it this way? what is wrong with me?
    let networks = [];
    let tempFT = typeAttr.FT;
    let tempNS = typeAttr.NS;
    typeAttr.LC ? tempFT = !typeAttr.FT : tempNS = !typeAttr.NS;
    networks.push(getCogStack(!typeAttr.IE, !typeAttr.LC, tempNS, tempFT));
    networks.push(getCogStack(!typeAttr.IE, !typeAttr.LC, !tempNS, !tempFT));
    networks.push(getCogStack(typeAttr.IE, !typeAttr.LC, !tempNS, !tempFT)); 
    networks.push(getCogStack(typeAttr.IE, !typeAttr.LC, tempNS, tempFT));

    return networks;
}

function getInferiorNetworks(type) {
    let typeAttr = (parseType(serializeType(type)));
    let networks = [];
    let tempFT = typeAttr.FT;
    let tempNS = typeAttr.NS;
    typeAttr.LC ? tempNS = !typeAttr.NS : tempFT = !typeAttr.FT;
    networks.push(getCogStack(typeAttr.IE, typeAttr.LC, !tempNS, tempFT));
    networks.push(getCogStack(typeAttr.IE, typeAttr.LC, tempNS, !tempFT));
    networks.push(getCogStack(!typeAttr.IE, typeAttr.LC, tempNS, !tempFT));
    networks.push(getCogStack(!typeAttr.IE, typeAttr.LC, !tempNS, tempFT)); 

    return networks;
}

function populateDisplay(){
    let count = 0;
    let networkList = [];
    networkList.push(...domNetwork);
    networkList.push(...auxNetwork);
    networkList.push(...tertNetwork);
    networkList.push(...infNetwork);
    document.querySelectorAll('.type').forEach((type)=> {
        type.innerHTML= '<p class="type-code">' + serializeType(networkList[count]) + '</p>' + 
                        '<p class="stack"><span class="conv">' + networkList[count].dom + '</span>' + 
                        '<sub class="divg">' + networkList[count].auth + '</sub>' +
                        '<span class="conv">' + networkList[count].aux + '</span>' +
                        '<sub class="divg">' + networkList[count].opp + '</sub></p>';
        count++;
    });
}
