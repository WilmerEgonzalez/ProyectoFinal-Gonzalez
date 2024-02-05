export let dbusuarios = [
    {
        id: 1,
        user: "Esteban",
        pass: "123456",
        admin: true,
    },
];

JSON.parse(localStorage.getItem("usuarios")) || localStorage.setItem("usuarios", JSON.stringify(dbusuarios));