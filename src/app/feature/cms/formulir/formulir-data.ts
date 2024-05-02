import { Content } from './formulir.model';

let component: Content[];

component = [
    {
        desc: 'Isi data teks dalam satu baris',
        iconId: 1,
        name: 'Kolom Satu Baris',
        property: {
            deskripsi: {
                placeholder: 'Tambah deskripsi kolom',
                type: 'text',
                value: '',
            },
            keterangan: {
                placeholder: 'Tambah keterangan kolom',
                type: 'text',
                value: '',
            },
            label: {
                placeholder: 'Edit label',
                type: 'text',
                value: '',
            },
            batasi_karakter: {
                placeholder: 'Maksimal karakter',
                type: 'number',
                value: '',
            },
        },
        tampilan: {
            batasi_karakter: false,
            deskripsi: true,
            primary_key: false,
            wajib_diisi: true,
        },
        type: 'single-line',
    },
    {
        desc: 'Isi data teks dalam multi baris',
        iconId: 2,
        name: 'Kolom Multi Baris',
        property: {
            deskripsi: {
                placeholder: 'Tambah deskripsi kolom',
                type: 'text',
                value: '',
            },
            keterangan: {
                placeholder: 'Tambah keterangan kolom',
                type: 'text',
                value: '',
            },
            label: {
                placeholder: 'Edit label',
                type: 'text',
                value: '',
            },
            batasi_karakter: {
                placeholder: 'Jumlah Batas Karakter',
                type: 'number',
                value: '',
            },
        },
        tampilan: {
            batasi_karakter: false,
            deskripsi: true,
            primary_key: false,
            wajib_diisi: true,
            pencatatan: false,
        },
        type: 'multiple-line',
    },
    {
        desc: 'Bilangan bulat atau desimal',
        format: {
            is_negative: false,
            option: [
                {
                    label: 'Bilangan Bulat',
                },
                {
                    label: 'Bilangan Desimal',
                },
            ],
            value: {
                label: 'Bilangan Bulat',
            },
        },
        iconId: 3,
        name: 'Angka',
        property: {
            deskripsi: {
                placeholder: 'Tambah deskripsi kolom',
                type: 'text',
                value: '',
            },
            keterangan: {
                placeholder: 'Tambah keterangan kolom',
                type: 'text',
                value: '',
            },
            label: {
                placeholder: 'Edit label',
                type: 'text',
                value: '',
            },
            batasi_karakter: {
                placeholder: 'Jumlah Batas Karakter',
                type: 'number',
                value: '',
            },
        },
        tampilan: {
            batasi_karakter: false,
            deskripsi: true,
            primary_key: false,
            wajib_diisi: true,
        },
        type: 'number',
    },
    {
        desc: 'Tanggal',
        format: {
            date: {
                option: [
                    {
                        label: 'DD/MM/YYYY',
                        value: 'dd/MM/yyyy',
                    },
                    {
                        label: 'MM/DD/YYYY',
                        value: 'MM/dd/yyyy',
                    },
                    {
                        label: 'YYYY/MM/DD',
                        value: 'yyyy/MM/dd',
                    },
                    {
                        label: 'YYYY/DD/MM',
                        value: 'yyyy/dd/MM',
                    },
                    {
                        label: 'DD-MM-YYYY',
                        value: 'dd-MM-yyyy',
                    },
                    {
                        label: 'MM-DD-YYYY',
                        value: 'MM-dd-yyyy',
                    },
                    {
                        label: 'YYYY-MM-DD',
                        value: 'yyyy-MM-dd',
                    },
                    {
                        label: 'YYYY-DD-MM',
                        value: 'yyyy-dd-MM',
                    },
                ],
                value: {
                    label: 'DD/MM/YYYY',
                    value: 'dd/MM/yyyy',
                },
            },
        },
        iconId: 4,
        name: 'Tanggal',
        property: {
            deskripsi: {
                placeholder: 'Tambah deskripsi kolom',
                type: 'text',
                value: '',
            },
            keterangan: {
                placeholder: 'Tambah keterangan kolom',
                type: 'text',
                value: '',
            },
            label: {
                placeholder: 'Edit label',
                type: 'text',
                value: '',
            },
        },
        tampilan: {
            deskripsi: true,
            wajib_diisi: true,
        },
        type: 'date',
        value: null,
    },
    {
        desc: 'Jam, menit dan detik',
        format: {
            time: {
                option: [
                    {
                        label: '24 Hours',
                        value: 'HH:mm',
                    },
                    {
                        label: 'AM/PM',
                        value: 'hh:mm',
                    },
                    {
                        label: '24 Hours with seconds',
                        value: 'HH:mm:ss',
                    },
                    {
                        label: 'AM/PM with seconds',
                        value: 'hh:mm:ss',
                    },
                ],
                value: {
                    label: 'AM/PM',
                    value: 'hh:mm',
                },
            },
        },
        iconId: 10,
        name: 'Waktu',
        property: {
            deskripsi: {
                placeholder: 'Tambah deskripsi kolom',
                type: 'text',
                value: '',
            },
            keterangan: {
                placeholder: 'Tambah keterangan kolom',
                type: 'text',
                value: '',
            },
            label: {
                placeholder: 'Edit label',
                type: 'text',
                value: '',
            },
        },
        tampilan: {
            deskripsi: true,
            wajib_diisi: true,
        },
        type: 'time',
        value: null,
    },
    {
        desc: 'Dengan format yg diterima',
        iconId: 5,
        name: 'Email',
        property: {
            deskripsi: {
                placeholder: 'Tambah deskripsi kolom',
                type: 'text',
                value: '',
            },
            keterangan: {
                placeholder: 'Tambah keterangan kolom',
                type: 'text',
                value: '',
            },
            label: {
                placeholder: 'Edit label',
                type: 'text',
                value: '',
            },
        },
        tampilan: {
            deskripsi: true,
            primary_key: false,
            wajib_diisi: true,
        },
        type: 'email',
    },
    {
        desc: 'Dengan enkripsi',
        iconId: 6,
        name: 'Kata Sandi',
        property: {
            deskripsi: {
                placeholder: 'Tambah deskripsi kolom',
                type: 'text',
                value: '',
            },
            keterangan: {
                placeholder: 'Tambah keterangan kolom',
                type: 'text',
                value: '',
            },
            label: {
                placeholder: 'Edit label',
                type: 'text',
                value: '',
            },
            minimal_karakter: {
                placeholder: 'Minimal karakter',
                type: 'number',
                value: '',
            },
            sertakan_angka: {
                placeholder: 'Sertakan angka',
                type: 'text',
                value: '',
            },
            sertakan_simbol: {
                placeholder: 'Sertakan simbol',
                type: 'text',
                value: '',
            },
        },
        tampilan: {
            deskripsi: true,
            wajib_diisi: true,
            minimal_karakter: false,
            sertakan_angka: true,
            sertakan_simbol: true,
        },
        type: 'password',
    },
    {
        desc: 'Dropdown or list options',
        format: {
            select: {
                option: [
                    {
                        label: 'Dropdown',
                        value: 'dropdown',
                    },
                    {
                        label: 'List',
                        value: 'list',
                    },
                ],
                value: {
                    label: 'Dropdown',
                    value: 'dropdown',
                },
            },
        },
        iconId: 7,
        name: 'Tombol Radio',
        option: [
            {
                id: 1,
                label: 'Opsi 1',
            },
            {
                id: 2,
                label: 'Opsi 2',
            },
            {
                id: 3,
                label: 'Opsi 3',
            },
            {
                id: 4,
                label: 'Opsi 4',
            },
        ],
        property: {
            deskripsi: {
                placeholder: 'Tambah deskripsi kolom',
                type: 'text',
                value: '',
            },
            keterangan: {
                placeholder: 'Tambah keterangan kolom',
                type: 'text',
                value: '',
            },
            label: {
                placeholder: 'Edit label',
                type: 'text',
                value: '',
            },
        },
        tampilan: {
            deskripsi: true,
            wajib_diisi: true,
        },
        type: 'select',
        value: '2b9282b1-6cab-422b-bb6c-2c57a56fb33e',
    },
    {
        desc: 'Plihan lebih dari satu',
        format: {
            multi_select: {
                option: [
                    {
                        label: 'Dropdown',
                        value: 'dropdown',
                    },
                    {
                        label: 'List',
                        value: 'list',
                    },
                ],
                value: {
                    label: 'Dropdown',
                    value: 'dropdown',
                },
            },
        },
        iconId: 8,
        name: 'Kotak Centang',
        option: [
            {
                id: 1,
                label: 'Opsi 1',
                selected: false,
            },
            {
                id: 2,
                label: 'Opsi 2',
                selected: false,
            },
            {
                id: 3,
                label: 'Opsi 3',
                selected: false,
            },
        ],
        property: {
            deskripsi: {
                placeholder: 'Tambah deskripsi kolom',
                type: 'text',
                value: '',
            },
            keterangan: {
                placeholder: 'Tambah keterangan kolom',
                type: 'text',
                value: '',
            },
            label: {
                placeholder: 'Edit label',
                type: 'text',
                value: '',
            },
        },
        tampilan: {
            deskripsi: true,
            wajib_diisi: true,
        },
        type: 'multi-select',
        value: [],
    },
    {
        desc: 'Berkas, gambar, video dll',
        iconId: 9,
        name: 'Media',
        property: {
            deskripsi: {
                placeholder: 'Tambah deskripsi kolom',
                type: 'text',
                value: '',
            },
            keterangan: {
                placeholder: 'Tambah keterangan kolom',
                type: 'text',
                value: '',
            },
            label: {
                placeholder: 'Edit label',
                type: 'text',
                value: '',
            },
        },
        tampilan: {
            deskripsi: true,
            primary_key: false,
            wajib_diisi: true,
        },
        type: 'media',
    },
    {
        desc: 'Ambil foto dengan kamera',
        iconId: 11,
        name: 'Foto',
        property: {
            name: {
                placeholder: 'Edit name',
                type: 'text',
                value: '',
            },
            ilustrasi_panduan: {
                placeholder: 'Edit ',
                type: 'text',
                value: '',
            },
            label: {
                placeholder: 'Edit label',
                type: 'text',
                value: '',
            },
            keterangan: {
                placeholder: 'Tambah keterangan kolom',
                type: 'text',
                value: 'Foto',
            },
            deskripsi: {
                placeholder: 'Tambah deskripsi kolom',
                type: 'text',
                value: '',
            },
            judul_panduan: {
                placeholder: 'Edit judul panduan  kolom',
                type: 'text',
                value: '',
            },
            deskripsi_panduan: {
                placeholder: 'Tambah deskripsi panduan kolom',
                type: 'text',
                value: '',
            },
            panduan: {
                placeholder: 'Edit panduan kolom ( Enter )',
                type: 'text',
                value: [],
            },
        },
        tampilan: {
            deskripsi: true,
            is_card: true,
            liveness: false,
            ocr: false,
            panduan: true,
            wajib_diisi: true,
        },
        type: 'media-capture',
    },
];

export { component };
