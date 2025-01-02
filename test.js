class LinkedList {
  constructor(head = null) {
    this.head = head;
  }

  append(data) {
    const node = new Node(data);

    let current;

    if (this.head === null) {
      this.head = node;
    } else {

      current = this.head;

      while (current.next) {
        current = current.next;
      }

      current.next = node;

    }

  }

  find(newPair) {
    let current = this.head;

    while (current) {
      if (current.data.key === newPair.key) {
        return current;
      }
      current = current.next;
    }

    return false;

  }

  pop() {
    let current;

    if (this.head === null) {
      return null;
    } else {
      current = this.head;

      while (current?.next) {
        if (current.next.next === null) {
          const tail = current.next;
          current.next = null;
          return tail;
        }
        current = current.next
      }
    }
  }

  replace(newPair) {
    let current = this.head;
  
    while (current) {
      if (current.data.key === newPair.key) {
        current.data.value = newPair.value;
        return current; // Successfully updated
      }
      current = current.next;
    }
  
    return false; // Key not found
  }

  remove(key) {
    const keyMatch = this.find({ key });
    
    if (!keyMatch) return false;

    let current = this.head;
    let keyMatchData;
    let newValue;

    while (current) {
      if (current.data.key === key && current.next === null) {
        this.pop();
        return current.data;
      } else if (current.data.key === key) {
        newValue = current.next.next;
        break;
      }
      current = current.next;
    }

    current = this.head;

    while (current) {
      if (current.data.key === key && current.next === null) {
        return keyMatchData;
      } else if (current.data.key === key) {
        keyMatchData = current.data;
        current.data = current.next.data;
        current.next = newValue;
        return keyMatchData;
      }
      current = current.next;
    }

    
  }

}

class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

const HashMap = function() {
  this.loadFactor = 0.75;
  this.capacity = Math.pow(2, 4);
  this.array = new Array(this.capacity);
  this.size = 0;
}

HashMap.prototype.set = function(key, value) {

  const isAtMaxCapacity = this.checkSize();

  if (isAtMaxCapacity) {
    this.increaseCapacity();
  } else {

  }


  const index = this.hash(key, this.capacity);

  
  if (index < 0 || index >= this.capacity) {
    throw new Error("Trying to access index out of bounds");
  }

  const doesKeyRepeat = this.checkKeyRepeat(key);

  
  if (doesKeyRepeat) {

    const currentData = this.array[index];

    if (currentData instanceof LinkedList) {
      currentData.replace({key, value});
    } else {
      currentData.value = value
    }

  } else {
    this.assignToArray(this.array, index, key, value);
    this.increaseSize();
  }

}

HashMap.prototype.checkKeyRepeat = function(key) {
  let repeat = false;

  for (const data of this.array) {

    if (data instanceof LinkedList) {

      if (data.find({key})) {
        repeat = true;
        break;
      }
    } else if (data) {

      if  (data.key === key) {
        repeat = true;
        break;
      }

    } else {
      continue;
    }
  }

  return repeat;
}


HashMap.prototype.checkSize = function() {
  return this.size === this.capacity * this.loadFactor;
}

HashMap.prototype.increaseCapacity = function() {
  this.capacity *= 2;
  const newArray = new Array(this.capacity);

  this.array.forEach(data => {
    if (data instanceof LinkedList) {
      let current = data.head;

      while(current) {
        const index = this.hash(current.data.key, this.capacity);

        this.assignToArray(newArray, index, current.data.key, current.data.value);
        current = current.next;
      }
      
    } else if (data) {
      const index = this.hash(data.key, this.capacity);

      this.assignToArray(newArray, index, data.key, data.value);
    }
  });

  this.array = newArray;
}

HashMap.prototype.hash = function(key, capacity) {
  let hashCode = 0;
      
  const primeNumber = 31;

  for (let i = 0; i < key.length; i++) {
    hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % capacity;
  }

  return hashCode;
}

HashMap.prototype.assignToArray = function(array, index, key, value) {

  const currentKeyValuePair = array[index];
  const newKeyValuePair = { key, value };

  if (!currentKeyValuePair) {
    array[index] = newKeyValuePair;
  } else if (currentKeyValuePair instanceof LinkedList) {
    currentKeyValuePair.append(newKeyValuePair);
  } else {
    const linkedList = new LinkedList();

    linkedList.append(currentKeyValuePair);
    linkedList.append(newKeyValuePair);

    array[index] = linkedList;
  }
}

HashMap.prototype.increaseSize = function() {
  this.size++;
  return this.size;
}

HashMap.prototype.decreaseSize = function() {
  this.size--;
  return this.size;
}

HashMap.prototype.get = function(key) {
  let keyMatch = null;

  const currentValues = this.array;

  
  for (const element of currentValues) {
    if (element instanceof LinkedList && element.find({ key })) {
      keyMatch = element.find({ key }).data.value;
      break;
    } else if (element && element.key === key) {
      keyMatch = element.value;
      break;
    }
  }

  return keyMatch;
}

HashMap.prototype.has = function(key) {
  let keyMatch = false;

  const currentValues = this.array;

  for (const element of currentValues) {
    if (element instanceof LinkedList && element.find({ key })) {
      keyMatch = true;
      break;
    } else if (element && element.key === key) {
      keyMatch = true;
      break;
    }
  }

  return keyMatch;
}

// Remove function will be here



HashMap.prototype.length = function() {
  return this.size;
}

HashMap.prototype.clear = function() {
  this.loadFactor = 0.75;
  this.capacity = Math.pow(2, 4);
  this.array = new Array(this.capacity);
  this.size = 0;
}

HashMap.prototype.keys = function() {
  const currentDataSet = this.array;

  const allKeys = [];
  
  for (const data of currentDataSet) {

    if (data instanceof LinkedList) {
      const list = data;

      let current = list.head;

      while (current) {
        allKeys.push(current.data.key);

        current = current.next;
      }

    } else if (data) {
      allKeys.push(data.key);
    }

  }

  return allKeys;
}

HashMap.prototype.values = function() {
  const currentDataSet = this.array;

  const allValues = [];
  
  for (const data of currentDataSet) {

    if (data instanceof LinkedList) {
      const list = data;

      let current = list.head;

      while (current) {
        allValues.push(current.data.value);

        current = current.next;
      }

    } else if (data) {
      allValues.push(data.value);
    }
    
  }

  return allValues;
}

HashMap.prototype.entries = function() {
  const currentDataSet = this.array;

  const allEntries = [];
  
  for (const data of currentDataSet) {

    if (data instanceof LinkedList) {
      const list = data;

      let current = list.head;

      while (current) {
        allEntries.push([current.data.key, current.data.value]);

        current = current.next;
      }

    } else if (data) {
      allEntries.push([data.key, data.value]);
    }
    
  }

  return allEntries;
}



HashMap.prototype.remove = function(key) {
  const keyMatch = this.has(key);

  if (!keyMatch) return false;

  const currentValues = this.array;

  for (let i = 0; i < currentValues.length; i++) {
    if (currentValues[i] instanceof LinkedList) {

      if (currentValues[i].find({key})) {
        currentValues[i].remove(key);
        
        if (!currentValues[i].next) {
          currentValues[i] = currentValues[i].head.data;
        }
        this.decreaseSize();
      }
      
    } else if (currentValues[i] && currentValues[i].key === key) {
      delete this.array[i];
      this.decreaseSize();
      return true;
    }
  }

  return true;
}



const test = new HashMap();
