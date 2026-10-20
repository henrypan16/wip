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

// Values of Loaners.Status. Any other value is the CustomerID holding the loaner.
export const LOANER_AVAILABLE = '0';
export const LOANER_DISCONTINUED = '-1';

// Category names shown in the dashboard's loaner status panel, in display order.
export const DASHBOARD_LOANER_SECTIONS = ['Backpack Computers', 'Tower Computers', 'Laser Printers', 'Thermal Printers'];

// Printable reports at /report/<type>.
export const REPORTS = {
    ready: { status: STATUS.READY, title: 'Current WIP Ready' },
    action: { status: STATUS.PENDING_ACTION, title: 'Current WIP Action' },
    repair: { status: STATUS.PENDING_REPAIR, title: 'Current WIP Repair' },
};

export const PAGE_SIZE = 10;
