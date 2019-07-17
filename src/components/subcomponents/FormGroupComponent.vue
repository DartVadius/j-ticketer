<template>
  <div class="q-pa-sm">
    <div class="text-body1 text-right">
      <span class="text-caption">Add form field</span>
      <q-btn type="button" class="glossy q-pa-xs q-mx-xs" @click="addRow" rounded color="primary" size="xs">
        <q-icon name="add_circle_outline" :key="'add-icon'" style="font-size: 1.5em;"></q-icon>
      </q-btn>
    </div>
    <template v-for="(row, index) in rows">
      <div class="row items-baseline q-col-gutter-sm" :key="row">
        <div class="col">
          <q-select
            v-model="rowsContainer[row].type"
            v-validate="'required'"
            name="type"
            :options="fieldsOptions"
            :dense="true"
            label="Select field type">
          </q-select>
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
        <div class="col-auto">
          <q-checkbox
            v-model="rowsContainer[row].requireValidation"
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
      <div v-show="rowsContainer[row].requireValidation" :key="row + '-validate'">куку</div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'FormGroupComponent',
  data () {
    return {
      rows: [0],
      rowsContainer: [
        {
          type: null,
          label: null,
          requireValidation: false,
          validators: []
        }
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
          label: 'Required',
          value: false,
          Type: 'bool'
        },
        {
          label: 'Value type',
          value: null,
          Type: 'select',
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
          label: 'Length',
          value: [],
          Type: 'range'
        },
        {
          label: 'Min/Max value',
          value: [],
          Type: 'range'
        }
      ],
      rowCounter: 0
    }
  },
  props: {
    formGroup: Object
  },
  methods: {
    addRow () {
      this.rowCounter++
      this.rowsContainer.push({
        type: null,
        label: null,
        requireValidation: false,
        validators: []
      })
      this.rows.push(this.rowCounter)
    },
    removeRow (row) {
      this.rows.splice(this.rows.indexOf(row), 1)
      delete this.rowsContainer[row]
    }
  }
}
</script>

<style scoped>

</style>
