interface StartDateEndDateFilterParams {
  tbAlias: string;
  begdaField: string;
  endaField: string;
}

interface StartDateEndDateFilterResult {
  query: ({ tbAlias, begdaField, endaField }: StartDateEndDateFilterParams) => string;
}

export const startDateEndDateFilter: StartDateEndDateFilterResult = {
  query: ({ tbAlias, begdaField, endaField }: StartDateEndDateFilterParams): string => {
    const startField = `${tbAlias}.${begdaField}`;
    const endField = `${tbAlias}.${endaField}`;

    return `
        (
          ${startField} <= NOW()
          AND
          (${endField} >= NOW() OR ${endField} IS NULL)
        )
    `;
  },
};
