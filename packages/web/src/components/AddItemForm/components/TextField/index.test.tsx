import { render, screen } from "@testing-library/react"
import { TextField } from "."
import { FormFieldType } from "../../enums"
import { IFormField } from "../../types"
import { IFieldProps } from "../../hooks/useForm/types"

describe("Given the TextField component", () => {
    it("should render the component", () => {
        render(
            <TextField
                field={EXAMPLE_FIELD}
                fieldProps={EXAMPLE_FIELD_PROPS}
                errors={EXAMPLE_ERRORS}
                isSubmitting={false}
            />
        )

        expect(screen.getAllByLabelText("Name")[0]).toBeVisible()
        expect(screen.getAllByLabelText("Name")[0]).toHaveValue("test")
    })

    it("should render error message when there is an error", () => {
        render(
            <TextField
                field={EXAMPLE_FIELD}
                fieldProps={EXAMPLE_FIELD_PROPS}
                errors={EXAMPLE_ERRORS}
                isSubmitting={false}
            />
        )

        expect(screen.getByText("Name is required")).toBeVisible()
    })

    it("should be disabled when isSubmitting is true", () => {
        render(
            <TextField
                field={EXAMPLE_FIELD}
                fieldProps={EXAMPLE_FIELD_PROPS}
                errors={EXAMPLE_ERRORS}
                isSubmitting={true}
            />
        )

        expect(screen.getAllByLabelText("Name")[0]).toBeDisabled()
    })
})

const EXAMPLE_FIELD: IFormField = {
    name: "name",
    label: "Name",
    type: FormFieldType.TEXT,
    value: "test"
}

const EXAMPLE_FIELD_PROPS: IFieldProps = {
    onChange: jest.fn(),
    value: "test"
}

const EXAMPLE_ERRORS: Record<string, string> = {
    name: "Name is required"
}