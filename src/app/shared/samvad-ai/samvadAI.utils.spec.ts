import { FacetValue } from './models/facet-value.model';
import { SearchFilterConfig } from './models/search-filter-config.model';
import {
  addOperatorToFilterValue,
  escapeRegExp,
  getFacetValueForType,
  stripOperatorFromFilterValue
} from './samvadAI.utils';

describe('Search Utils', () => {
  describe('getFacetValueForType', () => {
    let facetValueWithSamvadAIHref: FacetValue;
    let facetValueWithoutSamvadAIHref: FacetValue;
    let samvadAIFilterConfig: SearchFilterConfig;
    let facetValueWithSamvadAIHrefAuthority: FacetValue;

    beforeEach(() => {
      facetValueWithSamvadAIHref = Object.assign(new FacetValue(), {
        value: 'Value with search href',
        _links: {
          search: {
            href: 'rest/api/search?f.otherFacet=Other facet value,operator&f.facetName=Value with search href,operator'
          }
        }
      });
      facetValueWithSamvadAIHrefAuthority = Object.assign(new FacetValue(), {
        value: 'Value with search href',
        authorityKey: 'uuid',
        }
      );
      facetValueWithoutSamvadAIHref = Object.assign(new FacetValue(), {
        value: 'Value without search href'
      });
      samvadAIFilterConfig = Object.assign(new SearchFilterConfig(), {
        name: 'facetName'
      });
    });

    it('should retrieve the correct value from the search href', () => {
      expect(getFacetValueForType(facetValueWithSamvadAIHref, samvadAIFilterConfig)).toEqual('Value with search href,equals');
    });

    it('should retrieve the correct value from the Facet', () => {
      expect(getFacetValueForType(facetValueWithSamvadAIHrefAuthority, samvadAIFilterConfig)).toEqual('uuid,authority');
    });

    it('should return the facet value with an equals operator by default', () => {
      expect(getFacetValueForType(facetValueWithoutSamvadAIHref, samvadAIFilterConfig)).toEqual('Value without search href,equals');
    });
  });

  describe('stripOperatorFromFilterValue', () => {
    it('should strip equals operator from the value', () => {
      expect(stripOperatorFromFilterValue('value,equals')).toEqual('value');
    });
    it('should strip query operator from the value', () => {
      expect(stripOperatorFromFilterValue('value,query')).toEqual('value');
    });
    it('should strip authority operator from the value', () => {
      expect(stripOperatorFromFilterValue('value,authority')).toEqual('value');
    });
    it('should not strip a the part after the last , from a value if it isn\'t a valid operator', () => {
      expect(stripOperatorFromFilterValue('value,invalid_operator')).toEqual('value,invalid_operator');
    });
  });

  describe('addOperatorToFilterValue', () => {
    it('should add the operator to the value', () => {
      expect(addOperatorToFilterValue('value', 'equals')).toEqual('value,equals');
    });

    it('shouldn\'t add the operator to the value if it already contains the operator', () => {
      expect(addOperatorToFilterValue('value,equals', 'equals')).toEqual('value,equals');
    });
  });

  describe(`escapeRegExp`, () => {
    it(`should escape all occurrences of '.' in the input string`, () => {
      const input = `a.string.with.a.number.of.'.'s.in.it`;
      const expected = `a\\.string\\.with\\.a\\.number\\.of\\.'\\.'s\\.in\\.it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '*' in the input string`, () => {
      const input = `a*string*with*a*number*of*'*'s*in*it`;
      const expected = `a\\*string\\*with\\*a\\*number\\*of\\*'\\*'s\\*in\\*it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '+' in the input string`, () => {
      const input = `a+string+with+a+number+of+'+'s+in+it`;
      const expected = `a\\+string\\+with\\+a\\+number\\+of\\+'\\+'s\\+in\\+it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '-' in the input string`, () => {
      const input = `a-string-with-a-number-of-'-'s-in-it`;
      const expected = `a\\-string\\-with\\-a\\-number\\-of\\-'\\-'s\\-in\\-it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '?' in the input string`, () => {
      const input = `a?string?with?a?number?of?'?'s?in?it`;
      const expected = `a\\?string\\?with\\?a\\?number\\?of\\?'\\?'s\\?in\\?it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '^' in the input string`, () => {
      const input = `a^string^with^a^number^of^'^'s^in^it`;
      const expected = `a\\^string\\^with\\^a\\^number\\^of\\^'\\^'s\\^in\\^it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '$' in the input string`, () => {
      const input = `a$string$with$a$number$of$'$'s$in$it`;
      const expected = `a\\$string\\$with\\$a\\$number\\$of\\$'\\$'s\\$in\\$it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '{' in the input string`, () => {
      const input = `a{string{with{a{number{of{'{'s{in{it`;
      const expected = `a\\{string\\{with\\{a\\{number\\{of\\{'\\{'s\\{in\\{it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '}' in the input string`, () => {
      const input = `a}string}with}a}number}of}'}'s}in}it`;
      const expected = `a\\}string\\}with\\}a\\}number\\}of\\}'\\}'s\\}in\\}it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '(' in the input string`, () => {
      const input = `a(string(with(a(number(of('('s(in(it`;
      const expected = `a\\(string\\(with\\(a\\(number\\(of\\('\\('s\\(in\\(it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of ')' in the input string`, () => {
      const input = `a)string)with)a)number)of)')'s)in)it`;
      const expected = `a\\)string\\)with\\)a\\)number\\)of\\)'\\)'s\\)in\\)it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '|' in the input string`, () => {
      const input = `a|string|with|a|number|of|'|'s|in|it`;
      const expected = `a\\|string\\|with\\|a\\|number\\|of\\|'\\|'s\\|in\\|it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '[' in the input string`, () => {
      const input = `a[string[with[a[number[of['['s[in[it`;
      const expected = `a\\[string\\[with\\[a\\[number\\[of\\['\\['s\\[in\\[it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of ']' in the input string`, () => {
      const input = `a]string]with]a]number]of]']'s]in]it`;
      const expected = `a\\]string\\]with\\]a\\]number\\]of\\]'\\]'s\\]in\\]it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
    it(`should escape all occurrences of '\' in the input string`, () => {
      const input = `a\\string\\with\\a\\number\\of\\'\\'s\\in\\it`;
      const expected = `a\\\\string\\\\with\\\\a\\\\number\\\\of\\\\'\\\\'s\\\\in\\\\it`;
      expect(escapeRegExp(input)).toEqual(expected);
    });
  });
});
