<template>
  <div class="q-pa-sm">
    <div class="text-body1 text-right">
      <span class="text-caption">Add form field</span>
      <q-btn type="button" class="glossy q-pa-xs q-mx-xs" @click="addRow" rounded color="primary" size="xs">
        <q-icon name="add_circle_outline" :key="'add-icon'" style="font-size: 1.5em;"></q-icon>
      </q-btn>
    </div>
    <q-input
      v-model="title"
      name="formGroupLabel"
      type="text"
      v-validate="'required'"
      label="Form group label"
      :dense="true">
    </q-input>
    <span class="text-red-5 text-caption">{{ errors.first('formGroupLabel') }}</span>
    <template v-for="(row) in rows">
      <div class="row q-col-gutter-sm q-my-sm" :key="row">
        <div class="col">
          <q-select
            v-model="rowsContainer[row].type"
            v-validate="'required'"
            name="type"
            :options="fieldsOptions"
            :dense="true"
            @input="changeFieldType(row)"
            label="Select field type">
          </q-select>
          <span class="text-red-5 text-caption">{{ errors.first('type') }}</span>
        </div>
        <div class="col">
          <q-input
            v-model="rowsContainer[row].label"
            name="label"
            type="text"
            v-validate="'required'"
            label="Label"
            :dense="true">
          </q-input>
          <span class="text-red-5 text-caption">{{ errors.first('label') }}</span>
        </div>
        <div v-if="requireValidation(row)" class="col-auto self-baseline">
          <q-checkbox
            v-model="rowsContainer[row].requireValidation"
            @input="changeRequired(row)"
            :name="'rv-' + row"
            :dense="true">
            <q-item-label caption>Validation required</q-item-label>
          </q-checkbox>
        </div>
        <div class="col-auto">
          <q-btn type="button" class="glossy q-pa-xs q-mx-xs" @click="removeRow(row)" rounded color="negative" size="xs">
            <q-icon name="clear" :key="row + '-clear-icon'" style="font-size: 1.5em;"></q-icon>
          </q-btn>
        </div>
      </div>
      <div v-if="rowsContainer[row].requireValidation" :key="row + '-validate'">
        <template v-for="value in validatorTypes">
          <div :key="value.label" class="q-my-sm">
            <template v-if="value.key === 'required'">
              <q-checkbox
                v-model="rowsContainer[row].validators.required"
                :val="value.label"
                :dense="true">
                <q-item-label caption>{{value.label}}</q-item-label>
              </q-checkbox>
            </template>
            <template v-if="value.key === 'valueType' && extendedTypes.includes(rowsContainer[row].type)">
              <q-select
                v-model="rowsContainer[row].validators.valueType"
                @input="changeValueType(row)"
                :options="value.options"
                :dense="true"
                :label="value.label">
              </q-select>
            </template>
            <template v-if="value.key === 'length' && stringTypes.includes(rowsContainer[row].validators.valueType)">
              <q-item-label caption>{{value.label}}</q-item-label>
              <q-input
                v-model.number="rowsContainer[row].validators.length"
                type="number"
                name="field_length"
                v-validate="'min_value:0'"
                :dense="true"
                style="max-width: 200px">
              </q-input>
              <span class="text-red-5 text-caption">{{ errors.first('field_length') }}</span>
            </template>
            <template v-if="value.key === 'diapason' && numericTypes.includes(rowsContainer[row].validators.valueType)">
              <q-item-label caption>{{value.label}}</q-item-label>
              <div class="row q-gutter-sm">
                <q-input
                  v-model.number="rowsContainer[row].validators.diapason.min"
                  type="number"
                  class="col"
                  :dense="true"
                  name="min_value"
                  v-validate="'min_value:0'"
                  label="Min value"
                  style="max-width: 200px">
                </q-input>
                <q-input
                  v-model.number="rowsContainer[row].validators.diapason.max"
                  type="number"
                  class="col"
                  name="max_value"
                  v-validate="'min_value:0'"
                  :dense="true"
                  label="Max value"
                  style="max-width: 200px">
                </q-input>
              </div>
              <div class="row">
                <div class="col">
                  <span class="text-red-5 text-caption">{{ errors.first('min_value') }}</span>
                </div>
                <div class="col">
                  <span class="text-red-5 text-caption">{{ errors.first('max_value') }}</span>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'FormGroupComponent',
  data () {
    return {
      rows: [0],
      title: '',
      rowsContainer: [
        {
          type: null,
          label: null,
          requireValidation: false,
          validators: {
            required: false,
            valueType: null,
            length: null,
            diapason: {
              min: null,
              max: null
            }
          }
        }
      ],
      inputTypes: [
        'Input',
        'Select',
        'Multiselect',
        'Textarea'
      ],
      extendedTypes: [
        'Input',
        'Textarea'
      ],
      numericTypes: [
        'Integer',
        'Decimal'
      ],
      stringTypes: [
        'Alphabetic characters',
        'Alphabetic characters or numbers',
        'Alphabetic characters, numbers, dashes or underscores',
        'Alphabetic characters or spaces'
      ],
      fieldsOptions: [
        'Input',
        'Select',
        'Multiselect',
        'Checkbox',
        'Radiobutton',
        'Textarea',
        'Time picker',
        'Date picker',
        'Datetime picker',
        'Date range',
        'Color picker',
        'Button'
      ],
      validatorTypes: [
        {
          key: 'required',
          label: 'Required',
          type: 'bool'
        },
        {
          key: 'valueType',
          label: 'Value type',
          type: 'select',
          options: [
            'Alphabetic characters',
            'Alphabetic characters or numbers',
            'Alphabetic characters, numbers, dashes or underscores',
            'Alphabetic characters or spaces',
            'Integer',
            'Decimal',
            'Email'
          ]
        },
        {
          key: 'length',
          label: 'Field length',
          type: 'range'
        },
        {
          key: 'diapason',
          label: 'Min/Max value',
          type: 'range'
        }
      ],
      rowCounter: 0
    }
  },
  props: {
    formGroup: Number
  },
  created () {
    this.$eventBus.$on('validateNext', this.validateForm)
  },
  methods: {
    addRow () {
      this.rowCounter++
      this.rowsContainer.push({
        type: null,
        label: null,
        requireValidation: false,
        validators: {
          required: false,
          valueType: null,
          length: null,
          diapason: {
            min: null,
            max: null
          }
        }
      })
      this.rows.push(this.rowCounter)
    },
    removeRow (row) {
      this.rows.splice(this.rows.indexOf(row), 1)
      delete this.rowsContainer[row]
    },
    changeFieldType (row) {
      this.rowsContainer[row].requireValidation = false
      this.changeRequired(row)
    },
    changeRequired (row) {
      this.rowsContainer[row].validators = {
        required: false,
        valueType: null,
        length: null,
        diapason: {
          min: null,
          max: null
        }
      }
    },
    changeValueType (row) {
      this.rowsContainer[row].validators.length = null
      this.rowsContainer[row].validators.diapason = {
        min: null,
        max: null
      }
    },
    requireValidation (row) {
      return this.inputTypes.includes(this.rowsContainer[row].type)
    },
    validateForm () {
      let formData = {
        title: this.title,
        data: JSON.parse(JSON.stringify(this.rowsContainer))
      }
      this.$validator.validate().then(valid => {
        this.$emit('validationResult', { valid: valid, data: formData, index: this.formGroup })
      })
    }
  }
}
</script>

<style scoped>

</style>
