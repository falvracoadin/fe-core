import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    // {
    //     id: 1,
    //     label: 'Menu',
    //     isTitle: true
    // },
    {
        id: 1,
        label: 'Dashboard',
        icon: 'dashboard',
        link: '/dashboard',
        role: ['superadmin', 'jasmed'],
    },
    {
        id: 10,
        label: 'Master Data',
        icon: 'masterData',
        role: ['superadmin'],
        subItems: [
            {
                id: 11,
                label: 'CMS',
                icon: 'cms',
                parentId: 10,
                role: ['superadmin'],
                subItems: [
                    {
                        id: 12,
                        label: 'Formulir',
                        link: '/cms/formulir',
                        icon: 'formulir',
                        parentId: 10,
                        role: ['superadmin'],
                    },
                    {
                        id: 13,
                        label: 'Master Document',
                        link: '/cms/dokumen',
                        icon: 'dokumen',
                        parentId: 10,
                        role: ['superadmin'],
                    },
                    {
                        id: 16,
                        label: 'Kelola Banner',
                        link: '/cms/banner',
                        icon: 'banner',
                        parentId: 10,
                        role: ['superadmin'],
                    },
                ]
            }
        ]
    },
    {
        id: 2,
        label: 'Manajemen Pengguna',
        icon: 'penggunaManagement',
        role: ['superadmin'],
        subItems: [
            {
                id: 3,
                label: 'User',
                link: '/user',
                icon: 'user',
                parentId: 2,
                role: ['superadmin'],
            },
            // {
            //     id: 4,
            //     label: 'Role',
            //     link: '/role',
            //     role: ['superadmin'],
            //     icon: 'role',
            //     parentId: 2
            // },
        ],
    },
    {
        id: 5,
        label: 'Laporan Adjudicator',
        icon: 'adjudicator',
        role: ['superadmin', 'supervisor', 'operator', 'jasmed'],
        subItems: [
            {
                id: 6,
                label: 'Digital ID',
                icon: 'digital',
                parentId: 5,
                role: ['superadmin', 'supervisor', 'operator', 'jasmed'],
                subItems: [
                    {
                        id: 7,
                        label: 'KTP',
                        link: '/adjudicator/digital-id/ktp',
                        icon: 'ktp',
                        parentId: 6,
                        role: ['superadmin', 'supervisor', 'operator', 'jasmed'],
                    },
                    {
                        id: 8,
                        label: 'Kartu Rumah Sakit',
                        link: '/adjudicator/digital-id/kartu-kesehatan',
                        icon: 'krs',
                        parentId: 6,
                        role: ['superadmin', 'supervisor', 'operator', 'jasmed'],
                    },
                    {
                        id: 14,
                        label: 'Kartu Karyawan',
                        link: '/adjudicator/digital-id/kartu-karyawan',
                        icon: 'ktp',
                        parentId: 6,
                        role: ['superadmin', 'supervisor', 'operator', 'jasmed'],
                    },
                    {
                        id: 15,
                        label: 'Kartu Identitas Anak',
                        link: '/adjudicator/digital-id/kartu-identitas-anak',
                        icon: 'ktp',
                        parentId: 6,
                        role: ['superadmin', 'jasmed'],
                    },
                ]
            },
            {
                id: 9,
                label: 'Anomali Data',
                link: '/adjudicator/pembaruan-aplikasi',
                icon: 'anomali',
                role: ['superadmin'],
                parentId: 5
            },
        ],
    },
    {
        id: 20,
        label: 'Layanan Kesehatan',
        icon: 'kesehatan',
        role: ['superadmin', 'rekonsile', 'jasmed'],
        subItems:
            [
                {
                    id: 21,
                    label: 'Telemedicine',
                    icon: 'telemedicine',
                    parentId: 20,
                    role: ['superadmin', 'rekonsile', 'jasmed'],
                    subItems: [
                        {
                            id: 22,
                            label: 'Dokter',
                            link: '/kesehatan/telemedicine/dokter',
                            icon: 'submenuDot',
                            parentId: 21,
                            role: ['superadmin', 'rekonsile', 'jasmed'],
                        },
                        {
                            id: 23,
                            label: 'Jadwal Dokter',
                            link: '/kesehatan/telemedicine/jadwal-dokter',
                            icon: 'submenuDot',
                            parentId: 21,
                            role: ['superadmin', 'rekonsile', 'jasmed'],
                        },
                        {
                            id: 24,
                            label: 'Template Chat',
                            link: '/kesehatan/telemedicine/template-chat',
                            icon: 'submenuDot',
                            parentId: 21,
                            role: ['superadmin', 'rekonsile', 'jasmed'],
                        },
                    ]
                },
                {
                    id: 25,
                    label: 'Konsultasi',
                    icon: 'stethoscope',
                    parentId: 20,
                    role: ['superadmin', 'rekonsile', 'jasmed'],
                    subItems: [
                        {
                            id: 26,
                            label: 'Data Konsultasi',
                            link: '/kesehatan/konsultasi/konsultasi',
                            icon: 'submenuDot',
                            role: ['superadmin', 'rekonsile', 'jasmed'],
                            parentId: 25
                        },
                        {
                            id: 27,
                            label: 'Laporan Konsultasi',
                            link: '/kesehatan/konsultasi/laporan-konsultasi',
                            icon: 'submenuDot',
                            role: ['superadmin', 'rekonsile', 'jasmed'],
                            parentId: 25
                        },
                    ]
                },
                {
                    id: 28,
                    label: 'Reservasi',
                    link: '/kesehatan/reservasi',
                    icon: 'reservation',
                    role: [],
                    parentId: 20
                },
                {
                    id: 29,
                    label: 'Beli Obat',
                    link: '/kesehatan/beli-obat',
                    icon: 'medicine',
                    role: [],
                    parentId: 20
                },
            ],
    },
    {
        id: 30,
        label: 'Layanan Faskes',
        icon: 'faskes',
        role: ['superadmin', 'rekonsile', 'jasmed'],
        subItems:
            [
                {
                    id: 31,
                    label: 'Fasilitas Kesehatan',
                    link: '/faskes/fasilitas-kesehatan',
                    icon: 'bedstead',
                    role: ['superadmin', 'rekonsile', 'jasmed'],
                    parentId: 30
                },
                {
                    id: 32,
                    label: 'Spesialis',
                    link: '/faskes/spesialis',
                    icon: 'stethoscope',
                    role: ['superadmin', 'rekonsile', 'jasmed'],
                    parentId: 30
                },
            ],
    },
    {
        id: 33,
        label: 'Laporan Transaksi',
        icon: 'report',
        role: ['superadmin', 'rekonsile', 'jasmed'],
        subItems:
            [
                {
                    id: 34,
                    label: 'PPOB',
                    link: '/report/ppob',
                    icon: 'submenuDot',
                    parentId: 33,
                    role: ['superadmin', 'rekonsile', 'jasmed'],
                },
                {
                    id: 35,
                    label: 'Transfer Masuk',
                    link: '/report/transfer-masuk',
                    icon: 'submenuDot',
                    parentId: 33,
                    role: ['superadmin', 'rekonsile', 'jasmed'],
                },
                {
                    id: 36,
                    label: 'Transfer Keluar',
                    link: '/report/transfer-keluar',
                    icon: 'submenuDot',
                    parentId: 33,
                    role: ['superadmin', 'rekonsile', 'jasmed'],
                },
            ],
    },
    {
        id: 37,
        label: 'Logs Report',
        icon: 'log',
        role: ['superadmin', 'rekonsile', 'jasmed'],
        subItems:
            [
                {
                    id: 38,
                    label: 'User Activity',
                    link: '/logs/activity-user',
                    icon: 'submenuDot',
                    role: ['superadmin', 'rekonsile', 'jasmed'],
                    parentId: 37
                },
                {
                    id: 39,
                    label: 'Konsultasi',
                    link: '/logs/konsultasi',
                    icon: 'submenuDot',
                    role: ['superadmin', 'rekonsile', 'jasmed'],
                    parentId: 37
                },
            ],
    },
];

