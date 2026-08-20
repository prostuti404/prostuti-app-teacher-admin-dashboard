export const testQuestionFormation = (questionDetails: Record<string, string>, testType: string) => {
    // Extract all unique question indices from keys like "title_0", "option1_2", "correctOption_10"
    const uniqueIndices = [
        ...new Set(
            Object.keys(questionDetails).map((key) => {
                const parts = key.split('_');
                return Number(parts[parts.length - 1]);
            })
        ),
    ].sort((a, b) => a - b);

    const questionArr = [];

    for (const i of uniqueIndices) {
        const tempObj: Record<string, unknown> = {};

        for (const key of Object.keys(questionDetails)) {
            const parts = key.split('_');
            const keyIndex = Number(parts[parts.length - 1]);
            const fieldName = parts.slice(0, -1).join('_');

            if (i === keyIndex) {
                tempObj[fieldName] = questionDetails[key];
                tempObj['type'] = testType;
            }
        }

        // Build options array for MCQ type
        if (tempObj.type === 'MCQ') {
            tempObj.options = [
                tempObj.option1,
                tempObj.option2,
                tempObj.option3,
                tempObj.option4,
            ];

            // Remove individual option properties
            delete tempObj.option1;
            delete tempObj.option2;
            delete tempObj.option3;
            delete tempObj.option4;
        }

        if (Object.keys(tempObj).length !== 0) questionArr.push({ newQuestion: tempObj });
    }

    return questionArr;
};