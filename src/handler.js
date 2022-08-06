const { nanoid } = require("nanoid");
const notes = require("./notes");

// kode menyimpan catatan
const addNoteHandler = (request, h) => {
    //logika
    const { title, tags, body } = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title,
        tags,
        body,
        id,
        createdAt,
        updatedAt,
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: "success",
            message: "catatan berhasil ditambahkan",
            data: {
                notedId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "catatan gagal ditambahkan",
    });
    response.code(500);
    response.header("Access-Control-Allow-Origin", "*");
    return response;
};

// kode menampilkan catatan
const getAllNotesHandler = () => ({
    status: "success",
    data: {
        notes,
    },
});

// kode catatan lebih spesifik
const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            status: "success",
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: "fail",
        message: "catatan tidak ditemukan",
    });
    response.code(404);
    return response;
};

// kode mengubah catatan
const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };

        const response = h.response({
            status: "success",
            message: "catatan berhasil diperbarui",
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "gagal memperbarui catatan, Id tidak ditemukan",
    });
    response.code(404);
    return response;
};

// kode menghapus catatan
const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: "success",
            message: "catatan berhasil dihapus",
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "catatan gagal dihapus, Id tidak ditemukan",
    });
    response.code(404);
    return response;
};

module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler };