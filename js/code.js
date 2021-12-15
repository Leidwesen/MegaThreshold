function $S(selector) { return document.querySelector(selector); }
function $Sall(selector) { return document.querySelectorAll(selector); }

var vals = {
    wN: [null,false],
    wM: [null,false],
    k: [0.5,null],
    r: [1.0,null]
};
const p = 4; //precision
var showExact = false;

function getValues() {
	for (let [key, val] of Object.entries(vals)) {
	    let $data = $S(`#${key}`)
	    vals[key] = [$data.value, $data.checked]
	}
    }

function setValues() {
    for (let [key, val] of Object.entries(vals)) {
	let $data = $S(`#${key}`)
	$data.value = val[0];
	$data.checked = val[1];
    }
}

function ff(f) { //format float
    return parseFloat(f.toFixed(p));
}

function update() {
    getValues();
    let wN = vals.wN[1] ? 1.2 : 1.0,
	wM = vals.wM[1] ? 1.2 : 1.0,
	k = vals.k[0],
	r = vals.r[0];
    let o = (wM*r>=wN) ? 1 : 0;
    let coef_base = 11 - 10*(o*(1 - r*wM/wN) + k*wM/wN),
	coef_j = 1 - 3*r*wM/wN;
    $S('#functionText').innerHTML =
	`Minimum Optimal Lobby Size = ${ff(coef_base)} ${coef_j<0?'-':'+'} ${ff(Math.abs(coef_j))}*j`;
    func = (j) => {return coef_base + coef_j*j;};
    tableString = '<tr><th>j</th><th>MOLS</th>'
	+ (showExact ? '<th>Exact</th></tr>' : '');
    for (let j = 0; j <= 20; j++) {
	let cV = func(j);
	if (cV > 20) {
	    if (coef_j >= 0) {
		tableString += `<tr><td>≥${j}</td><td>Never</td>` +
		    (showExact ? `<td>${ff(cV)}</td></tr>` : '');
		break;
	    } else {
		tableString += `<tr><td>${j}</td><td>Never</td>` +
		    (showExact ? `<td>${ff(cV)}</td></tr>` : '');
	    }
	} else if (cV <= j+1) {
	    tableString += `<tr><td>≥${j}</td><td>Always</td>` +
		(showExact ? `<td>${ff(cV)}</td></tr>` : '');
	    break;
	} else {
	    tableString += `<tr><td>${j}</td><td>${Math.ceil(cV)}</td>` +
		(showExact ? `<td>${ff(cV)}</td></tr>` : '');
	}
    }
    $S('#dataTable').innerHTML = tableString;
}

window.addEventListener('load', function() {
    setValues();
    for (let node of $Sall('input')) {
	node.addEventListener('change', update);
    }
    for (let node of $Sall('[type=number]')) {
	node.addEventListener('change', (e)=>{
	    v =  e.srcElement.value
	    if ( v<=0) { e.srcElement.value = 0; } // resets empty / negative
	});
    }
    update();
    $S('#formPageBTN').addEventListener('click', (e)=>{
	$S('#formPage').classList.remove('hide');
	$S('#infoPage').classList.add('hide');
	$S('#exmpPage').classList.add('hide');
    });
    $S('#infoPageBTN').addEventListener('click', (e)=>{
	$S('#formPage').classList.add('hide');
	$S('#infoPage').classList.remove('hide');
	$S('#exmpPage').classList.add('hide');
    });
    $S('#exmpPageBTN').addEventListener('click', (e)=>{
	$S('#formPage').classList.add('hide');
	$S('#infoPage').classList.add('hide');
	$S('#exmpPage').classList.remove('hide');
    });
    $S('#exactBTN').addEventListener('click', (e)=>{
	showExact = !showExact;
	e.srcElement.innerText = `${showExact?'Hide':'Show'} Exact`;
	update();
    });
});
