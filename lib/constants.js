// Values of Status.IdStatus in the Access database.
export const STATUS = {
    RECEIVED: '1',
    PENDING_REPAIR: '2',
    PENDING_PARTS: '3',
    SCHEDULED: '4',
    COMPLETE: '5',
    READY: '6',
    PENDING_ACTION: '7',
    RMA: '8',
    RECYCLE: '9',
};

// Loaners.Status is blank (NULL) when the loaner is available, LOANER_DISCONTINUED
// when retired, and otherwise the service order number it is out with.
export const LOANER_DISCONTINUED = '-1';

// How the dashboard groups loaner categories, in display order. `nested` groups
// open into one section per category instead of a single list. Only active
// categories are shown; active categories not listed here go under "Other".
export const DASHBOARD_LOANER_GROUPS = [
    { title: 'Computers', categories: ['Backpack Computers', 'BaseLevel Computer'] },
    { title: 'Printers', categories: ['Laser Printers', 'Thermal Printers'] },
    { title: 'Imaging Devices', categories: ['Document Scanner', 'Barcode Scanner'] },
    { title: 'Accessories', categories: ['Monitor', 'Power Adapter', 'USB Hub', 'USB Fax Modem', 'Printer Supplies', 'Cables'], nested: true },
];

// How the task forms' loaner picker groups categories, in display order. Every
// other category is listed under "Other", which starts collapsed.
export const TASK_LOANER_GROUPS = [
    { title: 'Computers', categories: ['Backpack Computers', 'BaseLevel Computer'] },
    { title: 'Printers', categories: ['Laser Printers', 'Thermal Printers'] },
    { title: 'Monitors', categories: ['Monitor'] },
    { title: 'Scanners', categories: ['Document Scanner', 'Barcode Scanner'] },
];

// Printable reports at /report/<type>.
export const REPORTS = {
    ready: { status: STATUS.READY, title: 'Current WIP Ready' },
    action: { status: STATUS.PENDING_ACTION, title: 'Current WIP Action' },
    repair: { status: STATUS.PENDING_REPAIR, title: 'Current WIP Repair' },
};

export const PAGE_SIZE = 10;
