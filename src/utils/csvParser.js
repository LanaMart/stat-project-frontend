/**
 * csvParser.js - CSV Parsing Utility
 *
 * Безопасный парсинг CSV файлов с поддержкой:
 * - Заголовков
 * - Пропущенных строк
 * - Пустых значений
 * - Автоопределения типов данных
 *
 * Использует Papaparse для надежного парсинга CSV
 */

// Papaparse доступен глобально в React Native проекте
// Если нужно, импортируем: import Papa from 'papaparse';
// Но согласно документации, Papaparse уже доступен

/**
 * Определяет тип данных для значения
 * @param {string} value - значение для анализа
 * @returns {string} - 'number' | 'boolean' | 'date' | 'string'
 */

const Papa = require('papaparse');

const detectDataType = (value) => {
  if (!value || value.trim() === "") {
    return "string";
  }

  const trimmed = value.trim();

  // Проверка на boolean
  if (trimmed.toLowerCase() === "true" || trimmed.toLowerCase() === "false") {
    return "boolean";
  }

  // Проверка на число
  if (!isNaN(trimmed) && !isNaN(parseFloat(trimmed))) {
    return "number";
  }

  // Проверка на дату (различные форматы)
  const datePatterns = [
    /^\d{1,2}[./-]\d{1,2}[./-]\d{2,4}$/, // DD.MM.YYYY, DD/MM/YYYY, DD-MM-YYYY
    /^\d{4}[./-]\d{1,2}[./-]\d{1,2}$/, // YYYY.MM.DD, YYYY/MM/DD, YYYY-MM-DD
    /^\d{1,2}\s+\w+\s+\d{4}$/, // DD Month YYYY
  ];

  for (const pattern of datePatterns) {
    if (pattern.test(trimmed)) {
      return "date";
    }
  }

  return "string";
};

/**
 * Анализирует колонку и определяет наиболее подходящий тип данных
 * @param {Array} columnData - массив значений колонки
 * @returns {string} - определенный тип данных
 */
const inferColumnType = (columnData) => {
  const types = {};

  columnData.forEach((value) => {
    const type = detectDataType(value);
    types[type] = (types[type] || 0) + 1;
  });

  // Возвращаем наиболее часто встречающийся тип
  let maxCount = 0;
  let inferredType = "string";

  Object.entries(types).forEach(([type, count]) => {
    if (count > maxCount) {
      maxCount = count;
      inferredType = type;
    }
  });

  return inferredType;
};

/**
 * Парсит CSV файл и возвращает структурированные данные
 *
 * @param {File|Blob} file - CSV файл для парсинга
 * @returns {Promise<Object>} - Объект с результатами парсинга
 *
 * Возвращаемый объект:
 * {
 *   headers: string[], // Заголовки колонок
 *   rows: Array<Object>, // Строки данных как объекты
 *   rawData: Array<Array>, // Сырые данные (массив массивов)
 *   columnTypes: Object, // { columnName: 'number|string|boolean|date' }
 *   totalRows: number, // Общее количество строк
 *   totalColumns: number, // Общее количество колонок
 * }
 */
const parseCSV = async (file) => {
  return new Promise((resolve, reject) => {
    // Используем Papa.parse (доступен глобально через Papaparse)
    //const Papa = window.Papa || require("papaparse");

    if (!Papa) {
      reject(new Error("Papaparse library not available"));
      return;
    }

    Papa.parse(file, {
      // Настройки для робастного парсинга
      header: false, // Сначала парсим без header, чтобы определить его вручную
      dynamicTyping: false, // Отключаем автоопределение типов Papa, делаем сами
      skipEmptyLines: true, // Пропускаем пустые строки
      delimitersToGuess: [",", ";", "\t", "|"], // Автоопределение разделителя
      transformHeader: (header) => header.trim(), // Убираем пробелы из заголовков
      transform: (value) => (value ? value.trim() : ""), // Убираем пробелы из значений

      complete: (results) => {
        try {
          if (!results.data || results.data.length === 0) {
            reject(new Error("CSV file is empty"));
            return;
          }

          // 1️⃣ Извлекаем заголовки (первая строка)
          const headers = results.data[0].map((header, index) => {
            const trimmed = header ? header.trim() : "";
            return trimmed || `Column ${String.fromCharCode(65 + index)}`; // A, B, C...
          });

          // 2️⃣ Извлекаем строки данных (все, кроме первой)
          const rawData = results.data.slice(1);

          // 3️⃣ Создаем объекты строк { columnName: value }
          const rows = rawData.map((row) => {
            const rowObj = {};
            headers.forEach((header, index) => {
              rowObj[header] = row[index] || "";
            });
            return rowObj;
          });

          // 4️⃣ Определяем типы данных для каждой колонки
          const columnTypes = {};
          headers.forEach((header, index) => {
            const columnData = rawData.map((row) => row[index] || "");
            columnTypes[header] = inferColumnType(columnData);
          });

          // 5️⃣ Формируем результат
          const result = {
            headers,
            rows,
            rawData,
            columnTypes,
            totalRows: rawData.length,
            totalColumns: headers.length,
          };

          resolve(result);
        } catch (error) {
          reject(new Error(`CSV parsing error: ${error.message}`));
        }
      },

      error: (error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`));
      },
    });
  });
};

/**
 * Валидирует распарсенные данные CSV
 * @param {Object} parsedData - результат parseCSV
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
const validateParsedData = (parsedData) => {
  const errors = [];

  if (!parsedData.headers || parsedData.headers.length === 0) {
    errors.push("No headers found in CSV");
  }

  if (!parsedData.rows || parsedData.rows.length === 0) {
    errors.push("No data found in CSV");
  }

  if (parsedData.totalColumns > 100) {
    errors.push("Too many columns (max 100 supported)");
  }

  if (parsedData.totalRows > 10000) {
    errors.push("Too many rows (max 10,000 supported for preview)");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

module.exports = {
  parseCSV,
  detectDataType,
  inferColumnType,
  validateParsedData,
};
