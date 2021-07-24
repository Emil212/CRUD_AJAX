const d = document,
  $table = d.querySelector(".crud-table"),
  $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment();

const ajax = (options) => {
  let { url, method, success, error, data } = options;
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", (e) => {
    if (xhr.readyState !== 4) return;

    if (xhr.status >= 200 && xhr.status < 300) {
      let json = JSON.parse(xhr.responseText);
      success(json);
    } else {
      let message = xhr.statusText || "Ocurrio un error";
      error(`Error${xhr.status}: ${message}`);
    }
  });

  xhr.open(method || "GET", url);
  xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  xhr.send(JSON.stringify(data));
};

const getAll = () => {
  ajax({
    method: "GET",
    url: "http://localhost:3000/santos",
    success: (res) => {
      console.log(res);
      res.forEach((el) => {
        $template.querySelector(".name").textContent = el.nombre;
        $template.querySelector(".constelation").textContent = el.constelacion;
        $template.querySelector(".edit").dataset.id = el.id;
        $template.querySelector(".edit").dataset.name = el.nombre;
        $template.querySelector(".edit").dataset.constellation =
          el.constelacion;
        $template.querySelector(".delete").dataset.id = el.id;
        $template.querySelector(".delete").dataset.name = el.nombre;

        let $clone = d.importNode($template, true);
        $fragment.appendChild($clone);
      });

      $table.querySelector("tbody").appendChild($fragment);
    },
    error: (err) => {
      console.log(err);
      $table.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`);
    },
    data: null,
  });
};

//La funcion ajax esta dentro de la funcion getALL()

d.addEventListener("DOMContentLoaded", getAll());

d.addEventListener("submit", (e) => {
  if (e.target === $form) {
    e.preventDefault();

    if (!e.target.id.value) {
      //Create - POST
      ajax({
        method: "POST",
        url: "http://localhost:3000/santos",
        success: (res) => location.reload(),
        error: (err) =>
          $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
        data: {
          nombre: e.target.nombre.value,
          constelacion: e.target.constelacion.value,
        },
      });
    } else {
      //Update - PUT
      ajax({
        method: "PUT",
        url: `http://localhost:3000/santos/${e.target.dataset.id}`, //accedemos al id que esta oculto en el formulario
        success: (res) => location.reload(),
        error: (err) =>
          $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
        data: {
          nombre: e.target.nombre.value,
          constelacion: e.target.constelacion.value,
        },
      });
    }
  }
});

d.addEventListener("click", (e) => {
  if (e.target.matches(".edit")) {
    $title.textContent = "Editar Santo"; //Cambiamos el contenido de texto del titulo
    $form.nombre.value = e.target.dataset.name;
    $form.constelacion.value = e.target.dataset.constellation;
    $form.id.value = e.target.dataset.id;
  }

  //Aqui se copiaron los datos que estaban en el data set para que aparezcan en el formulario

  if (e.target.matches(".delete")) {
    let isDelete = confirm(
      `¿Estás seguro de que quieres eliminar a ${e.target.dataset.name}?`
    );
    if (isDelete) {
      ajax({
        method: "DELETE",
        url: `http://localhost:3000/santos/${e.target.dataset.id}`, //accedemos al dataset
        success: (res) => location.reload(),
        error: (err) =>
          $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
      });
    }
  }
});

//En las peticones AJAX es necesario agregar una cabecera a la  peticion con un setRequestHeader
//Hay que convertir el json a cadena de texto
//Se puede omnitir el parametro data cuando queremos pedir todos los santos
//Para este caso no conviene utilizar las funciones anonimas autoejecutables que siempre se manejan en el DOMContentLoaded
//Crearemos nuestra propia funcio getAll
//Depende de la ruta que se coloque en la URL va a ser lo que nos muestre
//El objeto res ya va a traer la informacion de los santos
//Los templates por defecto no se muestran en el DOM al menos que se haga un importNode
//Dentro del forEach se crean de manera automatica los dataset del nombre,id y constelacion
//Si el id del formulario viene bacio sabremos que tenemos que hacer una creacion, si viene con algun dato sabremos que tenemos que hacer  una actualizacion

//Primero se tiene que crear la funcion ajax, ella se crearan todas la configuraciones necesarias para poder ocuparla posteriormente
//La funcion ajax llevara un options el cual estara conformado por method, URL, success, error y data
//La siguiente vez que se necesite hacer alguna accion tipo crudse manda a llamar la funcion ajax, se hacen ña configuracion de los parametros que va a llevar
//Y lo quelas validaciones para cada uno de los casos

//location.reload() va a recargar el navegador si la peticion es exitosa
//El e.target para las peticiones de eliminar y actualizar son los botones
