class PriorityList {
    constructor(head = null) {
        this.head = head;
    }

    pop() {
        if (this.head == null) {
            return null;
        }
        const currHead = this.head;
        this.head = currHead.next;
        return currHead;
    }

    push(data, pos) {
        let curr = this.head;
        const toInsert = new ListNode(data, pos);
        if (curr == null) {
            this.head = toInsert;
            return;
        }
        if (curr.data > data) {
            this.head = toInsert;
            this.head.next = curr;
            return;
        }
        if (curr.next == null) {
            curr.next = toInsert;
            return;
        }
        while (curr.next != null && data > curr.next.data) {
            curr = curr.next;
        }
        if (curr.next == null) {
            curr.next = toInsert;
            return;
        }
        toInsert.next = curr.next;
        curr.next = toInsert;
        return;
    }
}

class ListNode {
    constructor(data, pos) {
        this.data = data;
        this.pos = pos;
        this.next = null;
    }
}

exports.PriorityList = PriorityList;
exports.ListNode = ListNode;