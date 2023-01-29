"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setWinBoardData = exports.checkWin = exports.getOnlineUsers = void 0;
const getOnlineUsers = (io) => {
    const users = {};
    io.sockets.sockets.forEach(socket => {
        if (socket.data.name) {
            users[socket.data.name] = socket;
        }
    });
    return users;
};
exports.getOnlineUsers = getOnlineUsers;
const checkWin = (board, shape) => {
    let countItems = 0;
    const length = board.length;
    for (let r = 0; r < length; r++) {
        let winRow = 'row';
        let winColumn = 'column';
        let winLeftTop = 'leftTop';
        let winLeftBottom = 'leftBottom';
        for (let i = 0; i < length; i++) {
            if (board[r][i] !== 'none')
                countItems++;
            if (board[r][i] !== shape)
                winRow = '';
            if (board[i][r] !== shape)
                winColumn = '';
            if (board[i][i] !== shape)
                winLeftTop = '';
            if (board[i][length - i - 1] !== shape)
                winLeftBottom = '';
        }
        const result = winRow || winColumn || winLeftTop || winLeftBottom;
        if (result) {
            return { status: 'win', payload: [result, r] };
        }
        if (countItems === length * length)
            return { status: 'draw' };
    }
    return { status: 'next' };
};
exports.checkWin = checkWin;
const setWinBoardData = (boardData, payload) => {
    if (payload) {
        switch (payload[0]) {
            case 'column':
                return boardData.map((row) => {
                    row[payload[1]] = row[payload[1]] === "circle" ? 'winCircle' : 'winCross';
                    return row;
                });
            case "row":
                return boardData.map((row, index) => {
                    if (payload[1] === index) {
                        return row.map(item => item === "circle" ? 'winCircle' : 'winCross');
                    }
                    return row;
                });
            case "leftBottom":
                return boardData.map((row, index) => {
                    row[row.length - index - 1] = row[row.length - index - 1] === "circle" ? 'winCircle' : 'winCross';
                    return row;
                });
            case "leftTop":
                return boardData.map((row, index) => {
                    row[index] = row[index] === "circle" ? 'winCircle' : 'winCross';
                    return row;
                });
        }
    }
};
exports.setWinBoardData = setWinBoardData;
