//hello you!!
let baseAttributes = new TypeAttributes();
let networks = [];

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
    if (type.match(/^[IE][NS][FT][PJ]$/g) || type.match(/^[IE][NS][FT]$/g) || type.match(/^[IE][FT][NS]$/g)) { //TODO: probably a better regex for this
        populateValues(type);
        populateDisplay();
    } else {
        //is this form validation?
        console.log('Please enter a valid 4 or 3 letter type code.')
    }
}

function populateValues(type) {
    networks = [];
    baseAttributes = type.length === 3 ? parseCPTType(type) : parseType(type);
    let domNetwork = getDomNetwork(baseAttributes.IE, baseAttributes.LC, baseAttributes.NS, baseAttributes.FT);
    networks.push(...domNetwork);
    let tertNetwork = [];
    domNetwork.forEach((baseType)=> {
        networks.push(shiftAuth(baseType));
        tertNetwork.push(shiftAux(baseType));
    });
    networks.push(...tertNetwork);
    tertNetwork.forEach((baseType)=> {
        networks.push(shiftAuth(baseType));
    })
}

//code -> attributes
function parseType(type) {
    let typeAttr = new TypeAttributes();
    let l1 = type.charAt(0);
    let l2 = type.charAt(1);
    let l3 = type.charAt(2);
    let l4 = type.charAt(3);
    typeAttr.IE = l1 == 'I';
    typeAttr.LC = ((typeAttr.IE && l4 === 'J') || (!typeAttr.IE && l4 === 'P'));
    typeAttr.NS = ((typeAttr.LC && l2 === 'N') || (!typeAttr.LC && l2 === 'S'));
    typeAttr.FT = ((typeAttr.LC && l3 === 'T') || (!typeAttr.LC && l3 === 'F'));
    return typeAttr;
}

function parseCPTType(type) {    
    let typeAttr = new TypeAttributes();
    let l1 = type.charAt(0);
    let l2 = type.charAt(1);
    let l3 = type.charAt(2);
    typeAttr.IE = l1 == 'I';
    typeAttr.LC = (l2 === 'N' || l2 === 'S');
    typeAttr.NS = (l2 === 'N' || l3 === 'N');
    typeAttr.FT = (l2 === 'F' || l3 === 'F');
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

function serializeCPTType(type) {
    let l1 = '';
    let l2 = '';
    let l3 = '';
    l1 = type.dom.charAt(1) === 'e' ? 'e' : 'i';
    l2 = type.dom.charAt(0);
    l3 = type.aux.charAt(0);

    return l1+l2+l3;
}

//hehe
function functionFunction(IE, LC, NS, FT) {
    return (LC ? (NS ? 'N' : 'S') : (FT ? 'F' : 'T')) + (IE ? 'i' : 'e');
}

function getCogStack(IE, LC, NS, FT) {
    const newStack = new CogStack();
    newStack.dom = functionFunction(IE, LC, NS, FT);
    newStack.auth = functionFunction(!IE, !LC, !NS, !FT);
    newStack.aux = functionFunction(IE, !LC, NS, FT);
    newStack.opp = functionFunction(!IE, LC, !NS, !FT);

    return newStack;
}

function getDomNetwork(IE, LC, NS, FT) {
    let types = [];
    types.push(getCogStack(IE, LC, NS, FT));
    types.push(getCogStack(!IE, LC, NS, FT));
    types.push(getCogStack(IE, LC, !NS, !FT));
    types.push(getCogStack(!IE, LC, !NS, !FT));

    return types;
}

function shiftAuth(baseType) {
    let newDom = baseType.auth;
    let newAuth = baseType.opp.charAt(0)+(baseType.opp.charAt(1) === 'e' ? 'i' : 'e');
    let newAux = baseType.dom.charAt(0)+(baseType.dom.charAt(1) === 'e' ? 'i' : 'e');
    let newOpp = baseType.aux;

    return new CogStack(newDom, newAuth, newAux, newOpp);
}

function shiftAux(baseType) {
    let newDom = baseType.aux;
    let newAuth = baseType.opp;
    let newAux = baseType.dom;
    let newOpp = baseType.auth;
    return new CogStack(newDom, newAuth, newAux, newOpp);
}

function populateDisplay(){
    let count = 0;
    document.querySelectorAll('.type').forEach((type)=> {
        type.setAttribute("id",serializeCPTType(networks[count]));
        type.innerHTML= '<br>'+
                        '<p class="type-code-3">' + serializeCPTType(networks[count]) + '</p>' + 
                        '<p class="type-code-4">(' + serializeType(networks[count]) + ')</p>' + 
                        '<br>'+
                        '<p class="stack"><span class="conv">' + networks[count].dom + '</span>' + 
                        '<span class="conv">' + networks[count].aux + '+</span></p>' +
                        '<p class="substack"><span class="divg">' + networks[count].opp + '</span>' +
                        '<span class="divg">' + networks[count].auth + '-</span></p>';
        count++;
    });
}